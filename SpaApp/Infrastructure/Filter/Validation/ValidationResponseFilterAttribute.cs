using FluentValidation;
using FluentValidation.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using SpaApp.Infrastructure.Filter.Validation.ClientValidationProvider;
using SpaApp.Infrastructure.Filter.Validation.Internal;
using System;
using System.Collections.Generic;
using FluentValidation.AspNetCore;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Humanizer;
using SpaApp.ModelValidation;

namespace SpaApp.Infrastructure.Filter.Validation
{
    /// <summary>
    /// Validation filter for model state validation.
    /// </summary>
    /// <seealso cref="ActionFilterAttribute" />
    public sealed partial class ValidationResponseFilterAttribute
        : ActionFilterAttribute
    {
        /// <summary>
        /// Action execution on any controller.
        /// </summary>
        /// <param name="context">Action context.</param>
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (context == null)
            {
                return;
            }

            var model = GetTheActionArgument(context);
            if (model == null && context.HttpContext.Request.Query.TryGetValue("validate", out var _))
            {
                context.Result = new JsonResult(string.Empty);
                return;
            }

            if (model == null)
            {
                return;
            }

            var validator = context.HttpContext.RequestServices
                .GetService(typeof(IValidator<>)
                .MakeGenericType(model.ModelType)) as IValidator;

            // In case of no validator and URL requested for validation rule
            if (validator == null && context.HttpContext.Request.Query.Keys.Any(val => val == "validation"))
            {
                context.Result = new EmptyResult();
                return;
            }

            if (validator == null)
            {
                return;
            }

            if (context.HttpContext.Request.Query.TryGetValue("validation", out var clientRuleRequest))
            {
                switch (clientRuleRequest)
                {
                    default:
                        context.Result = new JqueryValidatorProvider(validator).GetValidationRules();
                        break;
                }

                return;
            }

            var validationRules = GetValidationRule(context);
            model.ExecuteOnModel((modelValue) =>
            {
                var validationResult =
                    validator.Validate(new ValidationContext(
                        modelValue,
                        new PropertyChain(),
                        new RulesetValidatorSelector(validationRules)));

                validationResult.AddToModelState(context.ModelState, null);
            });

            // If requested for Ajax validation.
            if (context.HttpContext.Request.Query.TryGetValue("validate", out var modelProperty))
            {
                context.Result = new JsonResult(context.ModelState.ToDictionary(
                                kvp => kvp.Key,
                                kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).Humanize()));
                return;
            }

            if (!context.ModelState.IsValid)
            {
                context.Result = new BadRequestObjectResult(context.ModelState);
            }
        }

        /// <summary>
        /// Gets the action argument.
        /// </summary>
        /// <param name="actionContext">The action context.</param>
        /// <returns>Object type and object.</returns>
        private static ModelDefination GetTheActionArgument(ActionExecutingContext actionContext)
        {
            return (from arg in actionContext.ActionArguments.Values
                    let typ = arg?.GetType()
                    where typ != null && !typ.IsPrimitive && !typ.IsValueType && typ != typeof(string)
                    //&& typ != typeof(Kendo.Mvc.UI.DataSourceRequest) TODO: Note could exclude any other types
                    select new ModelDefination(arg)).FirstOrDefault();
        }

        /// <summary>
        /// Gets the validation rule set names for Fluent validation.
        /// </summary>
        /// <param name="actionContext">The action context.</param>
        /// <returns>Validation rules for Fluent mapping</returns>
        private static string[] GetValidationRule(ActionExecutingContext actionContext)
        {
            var ruleSetNames = new List<string>(2) { "default" };
            if (actionContext.ActionDescriptor is ControllerActionDescriptor descriptor)
            {
                if (descriptor.ActionName.Contains(nameof(OperationRequest.Delete)))
                {
                    ruleSetNames.Add(OperationRequest.Delete.ToString());
                }
                else if (descriptor.ActionName.Contains("Create") ||
                    descriptor.ActionName.Contains("Add") ||
                    descriptor.ActionName.Contains(nameof(OperationRequest.Insert)))
                {
                    ruleSetNames.Add(OperationRequest.Insert.ToString());
                }
                else if (descriptor.ActionName.Contains(nameof(OperationRequest.Update)))
                {
                    ruleSetNames.Add(OperationRequest.Update.ToString());
                }
            }

            return ruleSetNames.ToArray();
        }
    }
}
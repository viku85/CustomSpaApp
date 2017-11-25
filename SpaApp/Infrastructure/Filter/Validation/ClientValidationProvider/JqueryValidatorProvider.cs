using FluentValidation;
using FluentValidation.Internal;
using FluentValidation.Validators;
using Humanizer;
using Microsoft.AspNetCore.Mvc;
using SpaApp.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpaApp.Infrastructure.Filter.Validation.ClientValidationProvider
{
    /// <summary>
    /// jQuery.Validator rules provider.
    /// </summary>
    public class JqueryValidatorProvider
    {
        /// <summary>
        /// The validator
        /// </summary>
        private readonly IValidator Validator;

        /// <summary>
        /// Initializes a new instance of the <see cref="JqueryValidatorProvider"/> class.
        /// </summary>
        /// <param name="validator">The validator.</param>
        public JqueryValidatorProvider(IValidator validator)
        {
            Validator = validator;
        }

        /// <summary>
        /// Gets the validation rules based on jQuery.validator.
        /// </summary>
        /// <returns>Result along with rules.</returns>
        public IActionResult GetValidationRules()
        {
            if (Validator == null)
            {
                return new EmptyResult();
            }

            var validationObject = new Dictionary<string, object>();
            var errorObject = new Dictionary<string, Dictionary<string, string>>();

            var validatorDescriptor = Validator.CreateDescriptor();

            foreach (var valida in validatorDescriptor.GetMembersWithValidators())
            {
                var validations = new Dictionary<string, object>();
                var errors = new Dictionary<string, string>();
                foreach (var propertyValidator in valida)
                {
                    var validatorAdded = false;
                    Action<string, object, Action<MessageFormatter, Action<Func<string, string>>>> add = (validationType, value, format) =>
                    {
                        validatorAdded = true;
                        var formatter = new MessageFormatter();
                        formatter.AppendPropertyName(valida.Key.Humanize());
                        var template = propertyValidator.ErrorMessageSource.GetString(null);
                        format?.Invoke(formatter, (d) => { template = d?.Invoke(template); });

                        validations.SafeAdd(validationType, value);
                        errors.SafeAdd(validationType, formatter.BuildMessage(template));
                    };
                    if (propertyValidator is NotNullValidator
                      || propertyValidator is NotEmptyValidator)
                    {
                        add("required", true, null);
                    }

                    if (propertyValidator is EmailValidator)
                    {
                        add("email", true, null);
                    }

                    if (propertyValidator is LengthValidator lengthValidator)
                    {
                        if (lengthValidator.Max > 0)
                        {
                            add(
                                "maxlength",
                                lengthValidator.Max,
                            (formatter, template) =>
                            {
                                formatter.AppendArgument("MinLength", lengthValidator.Min);
                                formatter.AppendArgument("MaxLength", lengthValidator.Max);
                                template?.Invoke((tem) => !tem.Contains("TotalLength") ? tem :
                                        tem.Split(".")?.FirstOrDefault());
                            });
                        }

                        add(
                            "minlength",
                            lengthValidator.Min,
                            (formatter, template) =>
                            {
                                formatter.AppendArgument("MinLength", lengthValidator.Min);
                                formatter.AppendArgument("MaxLength", lengthValidator.Max);
                                template?.Invoke((tem) => !tem.Contains("TotalLength") ? tem :
                                tem.Split(".")?.FirstOrDefault());
                            });
                    }

                    if (propertyValidator is RegularExpressionValidator expressionValidator)
                    {
                        add("regex", expressionValidator.Expression, null);
                    }

                    if (!validatorAdded)
                    {
                        add("remote", valida.Key, null);
                    }
                }

                validations.IfNotEmpty(() => validationObject.Add(valida.Key, validations));
                errors.IfNotEmpty(() => errorObject.Add(valida.Key, errors));
            }

            return new JsonResult(new
            {
                rules = validationObject,
                messages = errorObject
            });
        }
    }
}
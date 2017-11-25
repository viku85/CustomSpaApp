using FluentValidation;
using System;

namespace SpaApp.ModelValidation.Base
{
    /// <summary>
    /// Base validation for all Fluent validations.
    /// </summary>
    /// <typeparam name="TModel">The type of the model.</typeparam>
    /// <seealso cref="AbstractValidator{TModel}" />
    public class BaseValidation<TModel>
        : AbstractValidator<TModel>
    {
        /// <summary>
        /// Defines a RuleSet that can be used to group together several validators.
        /// </summary>
        /// <param name="ruleSetName">The name of the ruleset.</param>
        /// <param name="action">Action that encapsulates the rules in the ruleset.</param>
        protected void RuleSet(OperationRequest ruleSetName, Action action)
        {
            RuleSet(ruleSetName.ToString(), action);
        }
    }
}
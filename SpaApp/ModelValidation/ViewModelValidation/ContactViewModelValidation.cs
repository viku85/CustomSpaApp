using FluentValidation;
using SpaApp.Models;
using SpaApp.ModelValidation.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpaApp.ModelValidation.ViewModelValidation
{
    /// <summary>
    /// Fluent validation for <see cref="ContactViewModel"/> view model.
    /// </summary>
    /// <seealso cref="BaseValidation{ContactViewModel}" />
    public class ContactViewModelValidation
        : BaseValidation<ContactViewModel>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ContactViewModelValidation"/> class.
        /// </summary>
        public ContactViewModelValidation()
        {
            RuleFor(model => model.Name)
                .NotEmpty()
                .Length(3, 100);

            RuleFor(model => model.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(model => model.Message)
                .NotEmpty()
                .Length(5, 2000);

            RuleFor(model => model.Subject)
                .NotEmpty();

            RuleSet(OperationRequest.Insert, () =>
            {
                RuleFor(model => model.Message)
                               .Must((model, field, token) =>
                           {
                               // TODO: Check against database if Email and message already exists.
                               return false;
                           }).WithMessage("Your information is already submitted.")
                           ;//.When(model => !String.IsNullOrEmpty(model.Message) && String.IsNullOrEmpty(model.Email));
            });
        }
    }
}
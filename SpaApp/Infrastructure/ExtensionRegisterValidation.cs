using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using SpaApp.Models;
using SpaApp.ModelValidation.ViewModelValidation;

namespace SpaApp.Infrastructure
{
    /// <summary>
    /// Extension to Register all Fluent validations.
    /// </summary>
    public static class ExtensionRegisterValidation
    {
        /// <summary>
        /// Adds FluentValidation for the application.
        /// </summary>
        /// <param name="services">The services.</param>
        /// <returns>The Service collection.</returns>
        public static IServiceCollection AddFluentValidation(this IServiceCollection services)
        {
            services.AddScoped<IValidator<ContactViewModel>, ContactViewModelValidation>();

            return services;
        }
    }
}
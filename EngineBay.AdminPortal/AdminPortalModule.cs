namespace EngineBay.AdminPortal
{
    using EngineBay.Core;

    public class AdminPortalModule : IModule
    {
        /// <inheritdoc/>
        public IServiceCollection RegisterModule(IServiceCollection services, IConfiguration configuration)
        {
            return services;
        }

        /// <inheritdoc/>
        public IEndpointRouteBuilder MapEndpoints(IEndpointRouteBuilder endpoints)
        {
            return endpoints;
        }

        public WebApplication AddMiddleware(WebApplication app)
        {
            app.UseStaticFiles();
            return app;
        }
    }
}
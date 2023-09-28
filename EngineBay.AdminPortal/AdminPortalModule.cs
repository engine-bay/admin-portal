namespace EngineBay.AdminPortal
{
    using System;
    using System.Reflection;
    using EngineBay.Core;
    using Microsoft.Extensions.FileProviders;

    public class AdminPortalModule : BaseModule
    {
        public override WebApplication AddMiddleware(WebApplication app)
        {
            var currentAssembly = Assembly.GetExecutingAssembly();
            if (currentAssembly is null)
            {
                throw new ArgumentException(nameof(currentAssembly));
            }

            var manifestEmbeddedProvider = new ManifestEmbeddedFileProvider(currentAssembly, "AdminPortal/dist");

            app.UseDefaultFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = manifestEmbeddedProvider,
                RequestPath = "/admin-portal",
            });
            return app;
        }
    }
}
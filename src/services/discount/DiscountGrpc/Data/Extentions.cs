using Microsoft.EntityFrameworkCore;

namespace DiscountGrpc.Data
{
    public static class Extentions
    {
        public static IApplicationBuilder UseMigration(this IApplicationBuilder app)
        {
            using (var scope = app.ApplicationServices.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<DiscountContext>();
                context.Database.MigrateAsync();
            }
            return app;
        }
    }
}

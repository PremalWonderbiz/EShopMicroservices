using BuildingBlocks.Behaviours;

namespace OrderingApplication
{
    public static class DependencyInjection
    {
        public static IServiceCollection  AddApplicationServices
            (this IServiceCollection services)
        {
            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
                cfg.AddOpenBehavior(typeof(ValidationBehaviour<,>));
                cfg.AddOpenBehavior(typeof(LoggingBehaviour<,>));
            });

            return services;
        }
    }
}

using MassTransit;
using Microsoft.FeatureManagement;

namespace OrderingApplication.Orders.EventHandlers.Domain
{
    public class OrderCreatedEventHandler
        (IPublishEndpoint publishEndpoint, IFeatureManager featureManager, ILogger<OrderCreatedEventHandler> logger)
        : INotificationHandler<OrderCreatedEvent>
    {
        public async Task Handle(OrderCreatedEvent notification, CancellationToken cancellationToken)
        {
            logger.LogInformation("Domain Event handled: {DomainEvent}", notification.GetType().Name);
            
            if(await featureManager.IsEnabledAsync("OrderFullfilment"))
            {
                var orderCreatedInterairedEvent = notification.order.ToOrderDto();
                await publishEndpoint.Publish(orderCreatedInterairedEvent, cancellationToken);
            }
        }
    }
}

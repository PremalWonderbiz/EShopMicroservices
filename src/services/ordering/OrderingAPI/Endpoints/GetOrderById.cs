using OrderingApplication.Orders.Queries.GetOrderById;

namespace OrderingAPI.Endpoints
{
    //public record GetOrderByIdRequest(string Name);
    public record GetOrderByIdResponse(OrderDto Order);

    public class GetOrderById : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/order/{orderId}", async (Guid orderId, ISender sender) =>
            {
                var result = await sender.Send(new GetOrderByIdQuery(orderId));

                var response = result.Adapt<GetOrderByIdResponse>();

                return Results.Ok(response);
            })
            .WithName("GetOrderById")
            .Produces<GetOrderByIdResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSummary("Get Order By Id")
            .WithDescription("Get Order By Id");
        }
    }
}

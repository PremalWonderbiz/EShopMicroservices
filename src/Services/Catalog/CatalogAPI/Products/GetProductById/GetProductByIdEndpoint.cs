using CatalogAPI.Exceptions;

namespace CatalogAPI.Products.GetProductById
{
    public record GetProductByIdResponse(Product Product);
    public class GetProductByIdEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/products/{id}", async (ISender sender, Guid id) =>
            {
                try
                {
                    var result = await sender.Send(new GetProductByIdQuery(id));
                    var response = result.Adapt<GetProductByIdResponse>();
                    return Results.Ok(response);
                }
                catch(ProductNotFoundException ex)
                {
                    return Results.NotFound(ex.Message);
                }
                catch(Exception ex)
                {
                    return Results.InternalServerError(ex.Message);
                }
            })
            .WithName("GetProductById")
            .Produces<GetProductByIdResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .WithSummary("Get Product By Id")
            .WithDescription("Get Product By Id");
        }
    }
}

namespace BasketAPI.Dtos
{
    public record OrderItemDto
    (
        Guid ProductId,
        int Quantity,
        decimal Price
    );
}

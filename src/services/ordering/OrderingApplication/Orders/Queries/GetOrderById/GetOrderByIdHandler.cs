namespace OrderingApplication.Orders.Queries.GetOrderById
{
    public class GetOrderByIdHandler
    (IApplicationDbContext dbContext)
        : IQueryHandler<GetOrderByIdQuery, GetOrderByIdResult>
    {
        public async Task<GetOrderByIdResult> Handle(GetOrderByIdQuery query, CancellationToken cancellationToken)
        {
            var order = await dbContext.Orders
                .Include(o => o.OrderItems)
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.Id == OrderId.Of(query.Id));

            if (order is null)
                throw new OrderNotFoundException(query.Id);

            return new GetOrderByIdResult(order.ToOrderDto());
        }
    }
}

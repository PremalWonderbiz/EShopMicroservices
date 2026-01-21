using Microsoft.EntityFrameworkCore;

namespace OrderingApplication.Orders.Queries.GetOrders
{
    public class GetOrdersHandler
        (IApplicationDbContext dbContext)
        : IQueryHandler<GetOrdersQuery, GetOrdersResult>
    {
        public async Task<GetOrdersResult> Handle(GetOrdersQuery query, CancellationToken cancellationToken)
        {
            //get orders with pagination 
            //return result
            var pageIndex = query.PaginationRequest.pageIndex;
            var pageSize = query.PaginationRequest.pageSize;
            var totalCount = await dbContext.Orders.LongCountAsync();
            var orders = await dbContext.Orders
                .Include(o => o.OrderItems)
                .OrderBy(o => o.OrderName.Value)
                .Skip(pageSize * pageIndex)
                .Take(pageSize)
                .ToListAsync();

            return new GetOrdersResult(
                new PaginatedResult<OrderDto>(
                    pageIndex,
                    pageSize,
                    totalCount,
                    orders.ToOrderDtoList())); 
        }
    }
}

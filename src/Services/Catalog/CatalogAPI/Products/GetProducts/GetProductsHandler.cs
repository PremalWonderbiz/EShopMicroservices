using BuildingBlocks.Pagination;

namespace CatalogAPI.Products.GetProducts
{
    public record GetProductsQuery(int PageNumber = 1, int PageSize = 10)
        : IQuery<GetProductsResult>;
    public record GetProductsResult(PaginatedResult<Product> Products);

    internal class GetProductsQueryHandler
        (IDocumentSession session)
        : IQueryHandler<GetProductsQuery, GetProductsResult>
    {
        public async Task<GetProductsResult> Handle(GetProductsQuery query, CancellationToken cancellationToken)
        {
            var pageIndex = query.PageNumber;
            var pageSize = query.PageSize;
            var totalCount = await session.Query<Product>().CountAsync(cancellationToken);
            var products = await session.Query<Product>()
                                        .ToPagedListAsync(query.PageNumber, query.PageSize, cancellationToken);

            return new GetProductsResult(
                    new PaginatedResult<Product>(
                        pageIndex,
                        pageSize,
                        totalCount,
                        products));
        }
    }
}

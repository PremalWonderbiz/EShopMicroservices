namespace CatalogAPI.Products.CreateProduct
{
    public record CreateProductCommand(string Name, List<string> category, string Description, string ImageFile, decimal Price)
        : ICommand<CreateProductResult>;
    public record CreateProductResult(Guid Id);

    internal class CreatProductCommandHandler 
        : ICommandHandler<CreateProductCommand, CreateProductResult>
    {
        public async Task<CreateProductResult> Handle(CreateProductCommand command, CancellationToken cancellationToken)
        {
            //create a product entity from command object
            //save to database
            //return CreateProductResult

            var product = new Product
            {
                Name = command.Name,
                Category = command.category,
                Description = command.Description,
                ImageFile = command.ImageFile,
                Price = command.Price
            };



           return new CreateProductResult(Guid.NewGuid());
        }
    }
}

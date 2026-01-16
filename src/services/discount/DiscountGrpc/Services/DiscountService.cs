using DiscountGrpc.Data;
using Grpc.Core;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace DiscountGrpc.Services
{
    public class DiscountService
        (DiscountContext dbContext, ILogger<DiscountService> logger)
        : DiscountProtoService.DiscountProtoServiceBase
    {
        public override async Task<CouponModel> GetDiscount(GetDiscountRequest request, ServerCallContext context)
        {
            //todo get discount from database
            var coupon = await dbContext.Coupons.FirstOrDefaultAsync(x => x.ProductName == request.ProductName);
            if (coupon is null) 
                coupon = new Models.Coupon { ProductName="No Discount", Amount=0, Description="No Discount Discription"};
            logger.LogInformation("Discount is retrvied for ProductName : {productName}, Amount : {amount}", coupon.ProductName, coupon.Amount);
            return coupon.Adapt<CouponModel>();
        }

        public async override Task<CouponModel> CreateDiscount(CreateDiscountRequest request, ServerCallContext context)
        {
            var coupon = request.Coupon.Adapt<Models.Coupon>();
            if(coupon is null)
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Coupon data is null"));
            dbContext.Coupons.Add(coupon);
            await dbContext.SaveChangesAsync();
            logger.LogInformation("Discount is successfully created. ProductName : {ProductName}", coupon.ProductName);
            return coupon.Adapt<CouponModel>();
        }
        
        public async override Task<CouponModel> UpdateDiscount(UpdateDiscountRequest request, ServerCallContext context)
        {
            var coupon = request.Coupon.Adapt<Models.Coupon>();
            if(coupon is null)
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Coupon data is null"));
            var existingCoupon = await dbContext.Coupons
                                .FirstOrDefaultAsync(x => x.Id == request.Coupon.Id);

            if (existingCoupon is null)
                throw new RpcException(new Status(
                    StatusCode.NotFound, "Coupon not found"));

            existingCoupon.ProductName = request.Coupon.ProductName;
            existingCoupon.Description = request.Coupon.Description;
            existingCoupon.Amount = request.Coupon.Amount;

            await dbContext.SaveChangesAsync();

            logger.LogInformation("Discount is successfully updated. ProductName : {ProductName}", coupon.ProductName);
            return existingCoupon.Adapt<CouponModel>();
        }

        public async override Task<DeleteDiscountResponse> DeleteDiscount(DeleteDiscountRequest request, ServerCallContext context)
        {
            var existingCoupon = await dbContext.Coupons
                                .FirstOrDefaultAsync(x => x.ProductName == request.ProductName);

            if (existingCoupon is null)
                throw new RpcException(new Status(
                    StatusCode.NotFound, "Coupon not found"));
            dbContext.Coupons.Remove(existingCoupon);
            await dbContext.SaveChangesAsync();

            logger.LogInformation("Discount is successfully deleted. ProductName : {ProductName}", request.ProductName);
            return new DeleteDiscountResponse { Success = true };
        }
    }
}

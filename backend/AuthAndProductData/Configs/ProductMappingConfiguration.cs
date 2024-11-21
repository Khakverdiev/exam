using AuthAndProductData.DTOs;
using AuthAndProductData.Models;
using AutoMapper;

namespace AuthAndProductData.Configs;

public class ProductMappingConfiguration
{
    public static MapperConfiguration ConfigureProductMappings()
    {
        return new MapperConfiguration(cfg =>
        {
            // Product -> ProductDto
            cfg.CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.Sizes, opt => opt.MapFrom(src => src.Sizes.Select(s => s.Size)))
                .ReverseMap();

            // Product -> ProductUpdateDto
            cfg.CreateMap<Product, ProductUpdateDto>()
                .ForMember(dest => dest.Sizes, opt => opt.MapFrom(src => src.Sizes.Select(s => s.Size)))
                .ReverseMap()
                .ForMember(dest => dest.Sizes, opt => opt.Ignore())
                .AfterMap((dto, product) =>
                {
                    product.Sizes = dto.Sizes
                        .SelectMany(size => size.Split(',').Select(s => s.Trim()))
                        .Select(size => new ProductSize { Size = size })
                        .ToList();
                });

            // Product -> ProductCreateDto
            cfg.CreateMap<Product, ProductCreateDto>()
                .ForMember(dest => dest.Sizes, opt => opt.MapFrom(src => src.Sizes.Select(s => s.Size)))
                .ReverseMap()
                .AfterMap((dto, product) =>
                {
                    product.Sizes = dto.Sizes.Select(size => new ProductSize { Size = size }).ToList();
                });

            // ProductSize -> ProductSizeDto
            cfg.CreateMap<ProductSize, ProductSizeDto>().ReverseMap();

           // Order -> OrderDto
           cfg.CreateMap<Order, OrderDto>()
               .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.OrderItems))
               .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.OrderStatus.StatusName))
               .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User != null ? src.User.Username : null))
               .ReverseMap();

           // Order -> OrderCreateDto
           cfg.CreateMap<Order, OrderCreateDto>().ReverseMap();

           // OrderRequestDto -> Order
           cfg.CreateMap<OrderRequestDto, Order>()
               .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.OrderItems))
               .ForMember(dest => dest.ShippingAddress, opt => opt.MapFrom(src => src.ShippingAddress))
               .ForMember(dest => dest.PaymentDetailsId, opt => opt.MapFrom(src => src.PaymentId))
               .ForMember(dest => dest.OrderStatus, opt => opt.Ignore())
               .ReverseMap();

           // OrderItemRequest -> OrderItem
           cfg.CreateMap<OrderItemRequest, OrderItem>()
               .ForMember(dest => dest.Size, opt => opt.MapFrom(src => src.Size))
               .ReverseMap();

           // OrderItem -> OrderItemDto
           cfg.CreateMap<OrderItem, OrderItemDto>()
               .ForMember<string>(dest => dest.Size, opt => opt.MapFrom(src => src.Size))
               .ReverseMap();

           // Review
           cfg.CreateMap<Review, ReviewDto>().ReverseMap();
           cfg.CreateMap<Review, ReviewCreateDto>().ReverseMap();
           cfg.CreateMap<Review, ReviewUpdateDto>().ReverseMap();

           // Payment
           cfg.CreateMap<PaymentDetails, PaymentDetailsDto>().ReverseMap();

           // ShippingAddress
           cfg.CreateMap<ShippingAddress, ShippingAddressDto>().ReverseMap();

           // OrderStatus
           cfg.CreateMap<OrderStatus, OrderStatusDto>().ReverseMap();
        });
    }
}
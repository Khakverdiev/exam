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
            cfg.CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.Sizes, opt => opt.MapFrom(src => src.Sizes.Select(s => s.Size)))
                .ReverseMap();

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

            cfg.CreateMap<Product, ProductCreateDto>()
                .ForMember(dest => dest.Sizes, opt => opt.MapFrom(src => src.Sizes.Select(s => s.Size)))
                .ReverseMap()
                .AfterMap((dto, product) =>
                {
                    product.Sizes = dto.Sizes.Select(size => new ProductSize { Size = size }).ToList();
                });

            cfg.CreateMap<ProductSize, ProductSizeDto>().ReverseMap();

           cfg.CreateMap<Order, OrderDto>()
               .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.OrderItems))
               .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.OrderStatus.StatusName))
               .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User != null ? src.User.Username : null))
               .ReverseMap();

           cfg.CreateMap<Order, OrderCreateDto>().ReverseMap();

           cfg.CreateMap<OrderRequestDto, Order>()
               .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.OrderItems))
               .ForMember(dest => dest.ShippingAddress, opt => opt.MapFrom(src => src.ShippingAddress))
               .ForMember(dest => dest.PaymentDetailsId, opt => opt.MapFrom(src => src.PaymentId))
               .ForMember(dest => dest.OrderStatus, opt => opt.Ignore())
               .ReverseMap();

           cfg.CreateMap<OrderItemRequest, OrderItem>()
               .ForMember(dest => dest.Size, opt => opt.MapFrom(src => src.Size))
               .ReverseMap();

           cfg.CreateMap<OrderItem, OrderItemDto>()
               .ForMember<string>(dest => dest.Size, opt => opt.MapFrom(src => src.Size))
               .ReverseMap();

           cfg.CreateMap<Review, ReviewDto>().ReverseMap();
           cfg.CreateMap<Review, ReviewCreateDto>().ReverseMap();
           cfg.CreateMap<Review, ReviewUpdateDto>().ReverseMap();

           cfg.CreateMap<PaymentDetails, PaymentDetailsDto>().ReverseMap();

           cfg.CreateMap<ShippingAddress, ShippingAddressDto>().ReverseMap();

           cfg.CreateMap<OrderStatus, OrderStatusDto>().ReverseMap();
        });
    }
}
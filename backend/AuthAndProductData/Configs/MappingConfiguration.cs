using AuthAndProductData.DTOs;
using AuthAndProductData.Models;
using AutoMapper;

namespace AuthAndProductData.Configs;

public class MappingConfiguration
{
    public static Mapper InitializeConfig()
    {
        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<User, RegisterDto>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email));
            
            cfg.CreateMap<AppRole, RoleDto>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ReverseMap();
        });

        var mapper = new Mapper(mapperConfig);

        return mapper;
    }
}
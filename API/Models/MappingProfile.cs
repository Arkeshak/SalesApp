using AutoMapper;
using API.Domain.Entities;

namespace API.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Client, ClientDto>().ReverseMap();
            CreateMap<Item, ItemDto>().ReverseMap();

            CreateMap<Order, OrderDto>()
                .ForMember(dest => dest.CustomerName,
                    opt => opt.MapFrom(src => src.Client != null ? src.Client.CustomerName : string.Empty))
                .ForMember(dest => dest.Lines,
                    opt => opt.MapFrom(src => src.Lines))
                .ReverseMap()
                .ForMember(dest => dest.Client, opt => opt.Ignore())
                .ForMember(dest => dest.Lines, opt => opt.MapFrom(src => src.Lines));

            CreateMap<OrderLine, OrderLineDto>()
                .ForMember(dest => dest.ItemCode,
                    opt => opt.MapFrom(src => src.Item != null ? src.Item.ItemCode : string.Empty))
                .ReverseMap()
                .ForMember(dest => dest.Item, opt => opt.Ignore());
        }
    }
}

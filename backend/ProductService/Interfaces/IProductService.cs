using AuthAndProductData.DTOs;
using AuthAndProductData.Models;

namespace ProductService.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllProductsAsync();
    Task<ProductDto> GetProductByIdAsync(int productId);
    Task<ProductDto> CreateProductAsync(ProductCreateDto productCreateDto);
    Task<ProductDto> UpdateProductAsync(int productId, ProductUpdateDto productUpdateDto);
    Task DeleteProductAsync(int productId);
}
using AuthAndProductData.Contexts;
using AuthAndProductData.DTOs;
using AuthAndProductData.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ProductService.Interfaces;

namespace ProductService.Classes;

public class ProductService : IProductService
{
    private readonly AuthContext _context;
    private readonly IMapper _mapper;

    public ProductService(AuthContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        var products = await _context.Products
            .Where(p => !p.IsDeleted)
            .Include(p => p.Sizes)
            .ToListAsync();

        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }

    public async Task<ProductDto> GetProductByIdAsync(int productId)
    {
        var product = await _context.Products
            .Include(p => p.Sizes)
            .FirstOrDefaultAsync(p => p.Id == productId);

        if (product == null)
        {
            throw new KeyNotFoundException("Product not found");
        }

        return _mapper.Map<ProductDto>(product);
    }

    public async Task<ProductDto> CreateProductAsync(ProductCreateDto productCreateDto)
    {
        var product = _mapper.Map<Product>(productCreateDto);

        if (productCreateDto.Sizes != null && productCreateDto.Sizes.Any())
        {
            product.Sizes = productCreateDto.Sizes.Select(size => new ProductSize { Size = size }).ToList();
        }

        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();

        return _mapper.Map<ProductDto>(product);
    }

    public async Task<ProductDto> UpdateProductAsync(int productId, ProductUpdateDto productUpdateDto)
    {
        var existingProduct = await _context.Products
            .Include(p => p.Sizes)
            .FirstOrDefaultAsync(p => p.Id == productId);

        if (existingProduct == null)
        {
            throw new KeyNotFoundException("Product not found");
        }

        _mapper.Map(productUpdateDto, existingProduct);

        if (productUpdateDto.Sizes != null)
        {
            existingProduct.Sizes = existingProduct.Sizes
                .Where(s => productUpdateDto.Sizes.Contains(s.Size))
                .ToList();

            var existingSizes = existingProduct.Sizes.Select(s => s.Size).ToList();
            foreach (var size in productUpdateDto.Sizes)
            {
                if (!existingSizes.Contains(size))
                {
                    existingProduct.Sizes.Add(new ProductSize { Size = size });
                }
            }
        }

        _context.Products.Update(existingProduct);
        await _context.SaveChangesAsync();

        return _mapper.Map<ProductDto>(existingProduct);
    }

    public async Task DeleteProductAsync(int productId)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == productId);

        if (product == null)
        {
            throw new KeyNotFoundException("Product not found");
        }

        if (await _context.OrderItems.AnyAsync(oi => oi.ProductId == productId))
        {
            product.IsDeleted = true;
            _context.Products.Update(product);
        }
        else
        {
            _context.Products.Remove(product);
        }

        await _context.SaveChangesAsync();
    }
}
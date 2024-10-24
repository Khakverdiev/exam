using aspnetexam.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace aspnetexam.Data.Contexts;

public class AuthContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<FavoriteProduct> FavoriteProducts { get; set; }
    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<PaymentDetails> PaymentDetails { get; set; }
    public DbSet<PaymentProviderDetails> PaymentProviderDetails { get; set; }

    public AuthContext()
    {
        
    }

    public AuthContext(DbContextOptions<AuthContext> options): base(options)
    {
        
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var userEntity = modelBuilder.Entity<User>();
        
        userEntity.HasKey(u => u.Id);
    
        userEntity.Property(u => u.Username)
            .IsRequired()
            .HasMaxLength(50);
        userEntity.HasIndex(u => u.Username)
            .IsUnique();
    
        userEntity.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(50);
        userEntity.HasIndex(u => u.Email)
            .IsUnique();
    
        userEntity.Property(u => u.Password)
            .IsRequired();
    
        // ----------------------------------------------
        
        var productEntity = modelBuilder.Entity<Product>();
    
        productEntity.HasKey(e => e.Id);
    
        productEntity.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(100);
    
        productEntity.Property(e => e.Description)
            .HasMaxLength(500);
    
        productEntity.Property(e => e.Price)
            .HasColumnType("decimal(18,2)");
    
        productEntity.Property(e => e.ImageUrl)
            .IsRequired(false);
    
        productEntity.Property(e => e.Quantity)
            .IsRequired()
            .HasDefaultValue(0);
    
        productEntity.Property(e => e.Category)
            .HasMaxLength(50);
    
        // ----------------------------------------------
        
        var orderEntity = modelBuilder.Entity<Order>();
        orderEntity.HasKey(o => o.Id);
        orderEntity.HasMany(o => o.OrderItems)
            .WithOne(oi => oi.Order)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        orderEntity.HasOne(o => o.ShippingAddress)
            .WithMany()
            .HasForeignKey(o => o.ShippingAddressId)
            .OnDelete(DeleteBehavior.Cascade);
        
        orderEntity.HasOne(o => o.PaymentDetails)
            .WithMany()
            .HasForeignKey(o => o.PaymentDetailsId)
            .OnDelete(DeleteBehavior.Cascade);

        // ----------------------------------------------
        
        var orderItemEntity = modelBuilder.Entity<OrderItem>();
        orderItemEntity.HasKey(oi => oi.Id);
        orderItemEntity.Property(oi => oi.Quantity).IsRequired();
        orderItemEntity.Property(oi => oi.Price).HasColumnType("decimal(18,2)");
        orderItemEntity.HasOne(oi => oi.Product)
            .WithMany()
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
    
        // ----------------------------------------------

        var reviewEntity = modelBuilder.Entity<Review>();
        reviewEntity.HasKey(r => r.Id);
    
        reviewEntity.Property(r => r.ReviewText)
            .IsRequired()
            .HasMaxLength(500);
    
        reviewEntity.Property(r => r.Rating)
            .IsRequired();
    
        reviewEntity.Property(r => r.CreatedAt)
            .IsRequired();
        
        reviewEntity.HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        reviewEntity.HasOne(r => r.Product)
            .WithMany(p => p.Reviews)
            .HasForeignKey(r => r.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    
        // ----------------------------------------------
        
        var favoriteProductEntity = modelBuilder.Entity<FavoriteProduct>();
        favoriteProductEntity.HasKey(fp => fp.Id);
    
        favoriteProductEntity.HasOne(fp => fp.User)
            .WithMany()
            .HasForeignKey(fp => fp.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    
        favoriteProductEntity.HasOne(fp => fp.Product)
            .WithMany()
            .HasForeignKey(fp => fp.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    
        // ----------------------------------------------

        var userProfileEntity = modelBuilder.Entity<UserProfile>();
    
        userProfileEntity.HasKey(up => up.Id);
    
        userProfileEntity.Property(up => up.FirstName)
            .HasMaxLength(50);
    
        userProfileEntity.Property(up => up.LastName)
            .HasMaxLength(50);
    
        userProfileEntity.Property(up => up.PhoneNumber)
            .HasMaxLength(15);
    
        userProfileEntity.Property(up => up.Address)
            .HasMaxLength(100);
    
        userProfileEntity.Property(up => up.City)
            .HasMaxLength(50);
    
        userProfileEntity.Property(up => up.Country)
            .HasMaxLength(50);
    
        userProfileEntity.Property(up => up.PostalCode)
            .HasMaxLength(10);
    
        userProfileEntity.HasOne(up => up.User)
            .WithOne()
            .HasForeignKey<UserProfile>(up => up.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
        
        // ----------------------------------------------
        
        var paymentEntity = modelBuilder.Entity<Payment>();
        
        paymentEntity.HasKey(p => p.Id);
        
        paymentEntity.Property(p => p.PaymentProvider).IsRequired().HasMaxLength(50);
        
        paymentEntity.Property(p => p.PaymentStatus).IsRequired().HasMaxLength(50);
        
        paymentEntity.Property(p => p.Amount).HasColumnType("decimal(18,2)").IsRequired();
        
        paymentEntity.Property(p => p.TransactionId).IsRequired().HasMaxLength(100);
        
        paymentEntity.HasOne(p => p.User)
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // ----------------------------------------------
        
        var paymentDetailsEntity = modelBuilder.Entity<PaymentDetails>();
        
        paymentDetailsEntity.HasKey(pd => pd.Id);
        
        paymentDetailsEntity.Property(pd => pd.CardNumber).IsRequired().HasMaxLength(16);
        
        paymentDetailsEntity.Property(pd => pd.CardExpiry).IsRequired().HasMaxLength(5);
        
        paymentDetailsEntity.Property(pd => pd.CardCVV).IsRequired();
        
        // ----------------------------------------------
        
        var paymentProviderDetailsEntity = modelBuilder.Entity<PaymentProviderDetails>();
        
        paymentProviderDetailsEntity.HasKey(ppd => ppd.Id);
        
        paymentProviderDetailsEntity.Property(ppd => ppd.ProviderName).IsRequired().HasMaxLength(50);
        
        paymentProviderDetailsEntity.Property(ppd => ppd.ApiKey).IsRequired().HasMaxLength(100);
        
        paymentProviderDetailsEntity.Property(ppd => ppd.SecretKey).IsRequired().HasMaxLength(100);
        
        }
}

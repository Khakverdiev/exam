using AuthAndProductData.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthAndProductData.Contexts;

public class AuthContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<AppRole> AppRoles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<OrderStatus> OrderStatuses { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductSize> ProductSizes { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<ShippingAddress> ShippingAddresses { get; set; }
    public DbSet<PaymentDetails> PaymentDetails { get; set; }

    public AuthContext()
    {
    }

    public AuthContext(DbContextOptions<AuthContext> options) : base(options)
    {
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var userEntity = modelBuilder.Entity<User>();
        userEntity.HasKey(u => u.Id);
        userEntity.Property(u => u.Username).IsRequired().HasMaxLength(50);
        userEntity.HasIndex(u => u.Username).IsUnique();
        userEntity.Property(u => u.Email).IsRequired().HasMaxLength(100);
        userEntity.HasIndex(u => u.Email).IsUnique();
        userEntity.Property(u => u.Password).IsRequired().HasMaxLength(256);

        // -----------------------------------------------------------------------------------
        var appRoleEntity = modelBuilder.Entity<AppRole>();
        appRoleEntity.HasKey(a => a.Id);
        appRoleEntity.Property(a => a.Name).IsRequired().HasMaxLength(50);
        appRoleEntity.HasIndex(a => a.Name).IsUnique();

        // -----------------------------------------------------------------------------------
        var userRoleEntity = modelBuilder.Entity<UserRole>();
        userRoleEntity.HasKey(u => u.Id);
        userRoleEntity
            .HasOne(ur => ur.AppRole)
            .WithMany(ar => ar.UserRoles)
            .HasForeignKey(ur => ur.RoleId)
            .OnDelete(DeleteBehavior.Cascade);
        userRoleEntity
            .HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // -----------------------------------------------------------------------------------
        var userProfileEntity = modelBuilder.Entity<UserProfile>();
        userProfileEntity.HasKey(up => up.Id);
        userProfileEntity.Property(up => up.FirstName).HasMaxLength(50);
        userProfileEntity.Property(up => up.LastName).HasMaxLength(50);
        userProfileEntity.Property(up => up.PhoneNumber).HasMaxLength(15);
        userProfileEntity.Property(up => up.Address).HasMaxLength(100);
        userProfileEntity.Property(up => up.City).HasMaxLength(50);
        userProfileEntity.Property(up => up.Country).HasMaxLength(50);
        userProfileEntity.Property(up => up.PostalCode).HasMaxLength(10);
        userProfileEntity
            .HasOne(up => up.User)
            .WithOne()
            .HasForeignKey<UserProfile>(up => up.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();

        // -----------------------------------------------------------------------------------
        var productEntity = modelBuilder.Entity<Product>();
        productEntity.HasKey(p => p.Id);
        productEntity.Property(p => p.Name).IsRequired().HasMaxLength(100);
        productEntity.Property(p => p.Description).HasMaxLength(500);
        productEntity.Property(p => p.Price).HasColumnType("decimal(18,2)");
        productEntity.Property(p => p.Category).IsRequired();
        productEntity.Property(p => p.ImageUrl).HasMaxLength(250);
        productEntity.Property(p => p.IsDeleted)
            .HasDefaultValue(false);
        productEntity.HasMany(p => p.Reviews)
            .WithOne(r => r.Product)
            .HasForeignKey(r => r.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
        productEntity.HasMany(p => p.Sizes)
            .WithOne(s => s.Product)
            .HasForeignKey(s => s.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // -----------------------------------------------------------------------------------
        
        var productSizeEntity = modelBuilder.Entity<ProductSize>();
        productSizeEntity.HasKey(s => s.Id);
        productSizeEntity.Property(s => s.Size).IsRequired().HasMaxLength(10);

        // -----------------------------------------------------------------------------------
        var reviewEntity = modelBuilder.Entity<Review>();
        reviewEntity.HasKey(r => r.Id);
        reviewEntity.Property(r => r.ReviewText).HasMaxLength(1000);
        reviewEntity.Property(r => r.Rating).IsRequired();
        reviewEntity.Property(r => r.Username).IsRequired().HasMaxLength(50);
        reviewEntity.HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.Username)
            .HasPrincipalKey(u => u.Username)
            .OnDelete(DeleteBehavior.Cascade);


        // -----------------------------------------------------------------------------------
        var orderEntity = modelBuilder.Entity<Order>();
        orderEntity.HasKey(o => o.Id);
        orderEntity.Property(o => o.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        orderEntity.Property(o => o.PaymentDetailsId)
            .IsRequired(false);
        orderEntity.HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.Username)
            .HasPrincipalKey(u => u.Username)
            .OnDelete(DeleteBehavior.Cascade);
        orderEntity.HasOne(o => o.ShippingAddress)
            .WithMany()
            .HasForeignKey(o => o.ShippingAddressId)
            .OnDelete(DeleteBehavior.Cascade);
        orderEntity.HasOne(o => o.OrderStatus)
            .WithMany(os => os.Orders)
            .HasForeignKey(o => o.OrderStatusId)
            .OnDelete(DeleteBehavior.Restrict);
        orderEntity.Property(o => o.TotalPrice)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        // -----------------------------------------------------------------------------------
        var orderItemEntity = modelBuilder.Entity<OrderItem>();
        orderItemEntity.HasKey(oi => oi.Id);
        orderItemEntity.Property(oi => oi.Price).HasColumnType("decimal(18,2)");
        orderItemEntity.Property(oi => oi.Size)
            .IsRequired()
            .HasMaxLength(10);
        orderItemEntity.HasOne(oi => oi.Order)
            .WithMany(o => o.OrderItems)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
        orderItemEntity.HasOne(oi => oi.Product)
            .WithMany()
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        // -----------------------------------------------------------------------------------
        var orderStatusEntity = modelBuilder.Entity<OrderStatus>();
        orderStatusEntity.HasKey(os => os.StatusId);
        orderStatusEntity.Property(os => os.StatusName).IsRequired().HasMaxLength(50);

        // -----------------------------------------------------------------------------------
        var shippingAddressEntity = modelBuilder.Entity<ShippingAddress>();
        shippingAddressEntity.HasKey(sa => sa.Id);
        shippingAddressEntity.Property(sa => sa.Country).IsRequired().HasMaxLength(100);
        shippingAddressEntity.Property(sa => sa.City).IsRequired().HasMaxLength(100);
        shippingAddressEntity.Property(sa => sa.FirstName).IsRequired().HasMaxLength(50);
        shippingAddressEntity.Property(sa => sa.LastName).IsRequired().HasMaxLength(50);
        shippingAddressEntity.Property(sa => sa.Address).IsRequired().HasMaxLength(250);
        shippingAddressEntity.Property(sa => sa.ZipCode).HasMaxLength(20);
        shippingAddressEntity.Property(sa => sa.PhoneNumber).HasMaxLength(20);

        // -----------------------------------------------------------------------------------
        var paymentDetailsEntity = modelBuilder.Entity<PaymentDetails>();
        paymentDetailsEntity.HasKey(pd => pd.Id);
        paymentDetailsEntity.Property(pd => pd.TransactionId)
            .IsRequired()
            .HasMaxLength(50);
        paymentDetailsEntity.HasIndex(pd => pd.TransactionId).IsUnique();
        paymentDetailsEntity.Property(pd => pd.Amount)
            .HasColumnType("decimal(18,2)")
            .IsRequired();
        paymentDetailsEntity.Property(pd => pd.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired();
    }
}
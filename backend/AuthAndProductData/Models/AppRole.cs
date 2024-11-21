namespace AuthAndProductData.Models;

public class AppRole
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; }

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
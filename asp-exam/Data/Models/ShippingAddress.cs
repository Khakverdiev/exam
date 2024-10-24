﻿namespace aspnetexam.Data.Models;

public class ShippingAddress
{
    public int Id { get; set; }
    public string Country { get; set; }
    public string City { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Address { get; set; }
    public string ZipCode { get; set; }
    public string PhoneNumber { get; set; }
}

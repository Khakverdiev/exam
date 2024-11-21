namespace aspnetexam.Data.Models;

public class ResetPassword
{
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
    public string ConfirmNewPassword { get; set; }
}

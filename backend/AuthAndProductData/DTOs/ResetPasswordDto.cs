namespace AuthAndProductData.DTOs;

public record ResetPasswordDto
(
    string OldPassword, 
    string NewPassword, 
    string ConfirmNewPassword 
);
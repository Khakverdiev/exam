namespace AuthAndProductData.DTOs;

public record ResetPasswordWithoutOldPasswordDto
(
    string Username, 
    string NewPassword, 
    string ConfirmNewPassword, 
    string Token
);
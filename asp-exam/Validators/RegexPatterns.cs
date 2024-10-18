﻿namespace aspnetexam.Validators;

public class RegexPatterns
{
    public const string usernamePattern = @"(?=.*[A-Z])(?=.*[a-z])(?=.*[_*&%$#@]).{5,}";
    public const string passwordPattern = @"(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[_*&%$#@]).{8,}";
}

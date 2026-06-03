package com.immoteam.immoteamdev.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PasswordResetResponse {
    private String resetToken;
    private String message;
}

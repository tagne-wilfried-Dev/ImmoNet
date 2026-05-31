package com.immoteam.immoteamdev.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshRequest {

    @NotBlank(message = "Le refresh token est obligatoire")
    private String refreshToken;
}

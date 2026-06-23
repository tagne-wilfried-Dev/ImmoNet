package com.immoteam.immoteamdev.controller;

import com.immoteam.immoteamdev.dto.ChangePasswordRequest;
import com.immoteam.immoteamdev.dto.ForgotPasswordRequest;
import com.immoteam.immoteamdev.dto.UpdateProfileRequest;
import com.immoteam.immoteamdev.dto.UserDto;
import com.immoteam.immoteamdev.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Contrôleur utilisateur pour récupérer et mettre à jour le profil.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
// Récupérer les informations de l'utilisateur connecté
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        UserDto userDto = userService.getCurrentUser(email);
        return ResponseEntity.ok(userDto);
    }
// Mettre à jour les informations de l'utilisateur connecté
    @PutMapping("/me")
    public ResponseEntity<UserDto> updateProfile(Authentication authentication,
                                                 @Valid @RequestBody UpdateProfileRequest request) {
        String email = authentication.getName();
        UserDto updatedUser = userService.updateProfile(email, request);
        return ResponseEntity.ok(updatedUser);
    }
// Changer le mot de passe de l'utilisateur connecté
    @PostMapping("/me/change-password")
    public ResponseEntity<String> changePassword(Authentication authentication,
                                               @Valid @RequestBody ChangePasswordRequest request) {
        String email = authentication.getName();
        userService.changePassword(email, request.getAncienMotDePasse(), request.getNouveauMotDePasse());
        return ResponseEntity.ok().build();
    }
// Devenir propriétaire (CLIENT -> PRO)
    @PostMapping("/me/devenir-pro")
    public ResponseEntity<UserDto> devenirProprietaire(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.devenirProprietaire(email));
    }
// Changer le mot de passe en cas d'oublie
    @PostMapping("/me/forget-password")
    public ResponseEntity<String> changePassword(Authentication authentication,
                                               @Valid @RequestBody ForgotPasswordRequest request) {
        String email = authentication.getName();
        userService.forgotPassword(email, request.getNouveauMotDePasse());
        return ResponseEntity.ok().build();
    }
}

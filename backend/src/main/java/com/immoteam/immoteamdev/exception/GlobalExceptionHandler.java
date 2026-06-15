package com.immoteam.immoteamdev.exception;

import com.immoteam.immoteamdev.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Gère les erreurs de validation des DTOs (annotations @NotBlank, @NotNull, etc.)
     * Retourne un 400 Bad Request avec le détail des champs en erreur.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        
        List<String> details = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Validation Échouée")
                .message("Un ou plusieurs champs sont invalides")
                .path(request.getRequestURI())
                .details(details)
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Gère les erreurs métier explicites (ex: "Utilisateur non trouvé", "Quota dépassé")
     * Retourne un 400 Bad Request (ou 404 si vous préférez créer une ResourceNotFoundException dédiée).
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
            IllegalArgumentException ex, HttpServletRequest request) {
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Requête Invalide")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Gère les tentatives d'accès non autorisées (RBAC)
     * Retourne un 403 Forbidden.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            AccessDeniedException ex, HttpServletRequest request) {
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.FORBIDDEN.value())
                .error("Accès Refusé")
                .message("Vous n'avez pas les permissions nécessaires pour accéder à cette ressource")
                .path(request.getRequestURI())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    /**
     * Gère les erreurs d'authentification (identifiants invalides, session expirée, etc.)
     * Retourne un 401 Unauthorized.
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(
            AuthenticationException ex, HttpServletRequest request) {
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.UNAUTHORIZED.value())
                .error("Authentification Échouée")
                .message("Identifiants invalides ou session expirée")
                .path(request.getRequestURI())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Gère les ressources non trouvées (ex: utilisateur introuvable, propriété introuvable)
     * Retourne un 404 Not Found.
     */
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ErrorResponse> handleNoSuchElementException(
            NoSuchElementException ex, HttpServletRequest request) {
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .error("Ressource Non Trouvée")
                .message(ex.getMessage() != null ? ex.getMessage() : "La ressource demandée n'existe pas")
                .path(request.getRequestURI())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    /**
     * Gère les conflits (ex: ressource déjà existante, quota dépassé, état invalide)
     * Retourne un 409 Conflict.
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalStateException(
            IllegalStateException ex, HttpServletRequest request) {
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.CONFLICT.value())
                .error("Conflit")
                .message(ex.getMessage() != null ? ex.getMessage() : "Une opération conflictuelle a été détectée")
                .path(request.getRequestURI())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    /**
     * Catch-all pour toute exception non gérée explicitement.
     * Retourne un 500 Internal Server Error avec un message générique pour éviter la fuite d'informations sensibles.
     * Les détails de l'exception doivent être loggés côté serveur pour le débogage.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(
            Exception ex, HttpServletRequest request) {
        
        // En production, il est recommandé de logger 'ex' ici (ex: avec SLF4J ou Logback)
        // pour le débogage, sans l'exposer au client.
        // Exemple:
        // logger.error("Erreur non gérée pour la requête {} {}", 
        //            request.getMethod(), request.getRequestURI(), ex);
        
        // Déterminer le code HTTP approprié basé sur le type d'exception
        HttpStatus status = determineHttpStatus(ex);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(getErrorMessage(ex, status))
                .path(request.getRequestURI())
                .build();

        return new ResponseEntity<>(errorResponse, status);
    }

    /**
     * Détermine le code HTTP approprié basé sur le type d'exception.
     */
    private HttpStatus determineHttpStatus(Exception ex) {
        if (ex instanceof NoSuchElementException) {
            return HttpStatus.NOT_FOUND;
        } else if (ex instanceof IllegalArgumentException || ex instanceof IllegalStateException) {
            return HttpStatus.BAD_REQUEST;
        } else if (ex instanceof AccessDeniedException) {
            return HttpStatus.FORBIDDEN;
        } else if (ex instanceof AuthenticationException) {
            return HttpStatus.UNAUTHORIZED;
        } else if (ex instanceof UnsupportedOperationException) {
            return HttpStatus.NOT_IMPLEMENTED;
        }
        // Par défaut, 500 pour les erreurs vraiment inattendues
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    /**
     * Génère un message d'erreur approprié selon le type d'exception et le code HTTP.
     */
    private String getErrorMessage(Exception ex, HttpStatus status) {
        if (status == HttpStatus.INTERNAL_SERVER_ERROR) {
            return "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.";
        }
        return ex.getMessage() != null ? ex.getMessage() : status.getReasonPhrase();
    }
}
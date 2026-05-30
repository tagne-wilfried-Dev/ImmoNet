package com.immoteam.immoteamdev.exception;

/**
 * Exception levée quand une ressource (utilisateur, annonce, etc.) n'est pas trouvée
 */
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

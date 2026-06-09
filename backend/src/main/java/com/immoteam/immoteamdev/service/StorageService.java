package com.immoteam.immoteamdev.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    /**
     * Sauvegarde le fichier et retourne l'URL publique d'accès.
     */
    String saveFile(MultipartFile file);
}
package com.immoteam.immoteamdev.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Implémentation locale temporaire pour le stockage des fichiers.
 * En production (V2), elle sera remplacée par une implémentation Cloudinary ou S3.
 */
@Service
public class LocalStorageServiceImpl implements StorageService {

    private final Path root = Paths.get("uploads");

    @Override
    public String saveFile(MultipartFile file) {
        try {
            // Création du dossier s'il n'existe pas
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            // Génération d'un nom unique
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.root.resolve(filename));

            // On retourne l'URL relative (qui sera préfixée par le domaine en prod)
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Impossible de sauvegarder le fichier : " + e.getMessage());
        }
    }
}

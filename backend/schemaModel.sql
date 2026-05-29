-- ============================================================
-- ImmoNet - Base de données (Phase 1 - Sans validation Admin)
-- Version: 1.1
-- Date: Mai 2026
-- SGBD: MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS immonet_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE immonet_db;

-- ============================================================
-- 1. TABLE UTILISATEURS (Inscription directe → ACTIVE)
-- ============================================================
CREATE TABLE utilisateurs (
    id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe_hash VARCHAR(255) NOT NULL COMMENT 'BCrypt cost 12',
    telephone VARCHAR(20) NOT NULL,
    date_inscription DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dernier_login DATETIME NULL,
    statut ENUM('ACTIVE', 'SUSPENDED', 'BANNED') NOT NULL DEFAULT 'ACTIVE' COMMENT 'Plus de validation admin. Activation directe.',
    role ENUM('CLIENT', 'PRO', 'ADMIN') NOT NULL DEFAULT 'CLIENT',
    email_verifie BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Vérification technique obligatoire via lien email.',
    avatar_url VARCHAR(500) NULL,
    consentement_cgu_date DATETIME NULL,
    reset_token VARCHAR(255) NULL,
    reset_token_expires DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_telephone (telephone),
    INDEX idx_role_statut (role, statut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. TABLE ABONNEMENTS PRO (Activation via Stripe Webhook)
-- ============================================================
CREATE TABLE abonnements_pro (
    id VARCHAR(36) PRIMARY KEY,
    utilisateur_id VARCHAR(36) NOT NULL,
    type_abonnement ENUM('STARTER', 'BUSINESS', 'PREMIUM') NOT NULL,
    date_debut DATETIME NOT NULL,
    stripe_subscription_id VARCHAR(255) NULL,
    stripe_payment_id VARCHAR(255) NULL,
    actif BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Passe à TRUE via webhook Stripe après paiement.',
    montant_paye DECIMAL(10, 2) NOT NULL,
    devise VARCHAR(3) NOT NULL DEFAULT 'XAF',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    INDEX idx_utilisateur (utilisateur_id),
    INDEX idx_actif (actif)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. TABLE BIENS (Publication directe par le propriétaire)
-- ============================================================
CREATE TABLE biens (
    id VARCHAR(36) PRIMARY KEY,
    proprietaire_id VARCHAR(36) NOT NULL,
    titre VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    type_operation ENUM('VENTE', 'LOCATION') NOT NULL,
    type_bien ENUM('APPARTEMENT', 'VILLA', 'STUDIO', 'TERRAIN', 'BUREAU', 'LOCAL_COMMERCIAL', 'CHAMBRE_MEUBLEE', 'MAISON') NOT NULL,
    adresse TEXT NOT NULL,
    ville VARCHAR(100) NOT NULL,
    quartier VARCHAR(100) NULL,
    pays VARCHAR(100) NOT NULL DEFAULT 'Cameroun',
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    prix DECIMAL(15, 2) NOT NULL,
    prix_nuit DECIMAL(15, 2) NULL COMMENT 'Location courte durée',
    prix_semaine DECIMAL(15, 2) NULL,
    prix_mois DECIMAL(15, 2) NULL,
    charges_incluses BOOLEAN NOT NULL DEFAULT FALSE,
    montant_charges DECIMAL(15, 2) NULL,
    caution DECIMAL(15, 2) NULL,
    prix_negoceable BOOLEAN NOT NULL DEFAULT FALSE,
    surface DECIMAL(10, 2) NOT NULL COMMENT 'en m²',
    nb_pieces INT NULL,
    nb_chambres INT NULL,
    nb_sdb INT NULL,
    etage INT NULL,
    statut ENUM('BROUILLON', 'PUBLIE', 'EN_LOCATION', 'VENDU', 'ARCHIVE', 'SUSPENDU') NOT NULL DEFAULT 'BROUILLON' COMMENT 'Publication directe. Plus de validation admin.',
    date_publication DATETIME NULL,
    date_expiration DATETIME NULL,
    nb_vues INT NOT NULL DEFAULT 0,
    nb_favoris INT NOT NULL DEFAULT 0,
    est_boost BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (proprietaire_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    INDEX idx_proprietaire (proprietaire_id),
    INDEX idx_type_operation (type_operation),
    INDEX idx_type_bien (type_bien),
    INDEX idx_statut (statut),
    INDEX idx_ville (ville),
    INDEX idx_prix (prix),
    INDEX idx_date_publication (date_publication),
    INDEX idx_coords (latitude, longitude),
    FULLTEXT idx_search (titre, description, adresse, ville, quartier)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. TABLE PHOTOS DES BIENS
-- ============================================================
CREATE TABLE photos_biens (
    id VARCHAR(36) PRIMARY KEY,
    bien_id VARCHAR(36) NOT NULL,
    url_cloudinary VARCHAR(500) NOT NULL,
    public_id_cloudinary VARCHAR(255) NOT NULL,
    ordre INT NOT NULL DEFAULT 0,
    est_principale BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (bien_id) REFERENCES biens(id) ON DELETE CASCADE,
    INDEX idx_bien (bien_id),
    INDEX idx_ordre (ordre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. TABLE EQUIPEMENTS
-- ============================================================
CREATE TABLE equipements (
    id VARCHAR(36) PRIMARY KEY,
    bien_id VARCHAR(36) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    categorie ENUM('CONFORT', 'SECURITE', 'LOISIRS', 'SERVICES', 'AUTRE') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (bien_id) REFERENCES biens(id) ON DELETE CASCADE,
    INDEX idx_bien (bien_id),
    INDEX idx_nom (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. TABLE DISPONIBILITES
-- ============================================================
CREATE TABLE disponibilites (
    id VARCHAR(36) PRIMARY KEY,
    bien_id VARCHAR(36) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    statut ENUM('DISPONIBLE', 'RESERVE', 'INDISPONIBLE') NOT NULL DEFAULT 'DISPONIBLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (bien_id) REFERENCES biens(id) ON DELETE CASCADE,
    INDEX idx_bien_dates (bien_id, date_debut, date_fin),
    INDEX idx_statut (statut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. TABLE RESERVATIONS
-- ============================================================
CREATE TABLE reservations (
    id VARCHAR(36) PRIMARY KEY,
    bien_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    type_reservation ENUM('LOCATION', 'VISITE', 'ACHAT') NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    montant_total DECIMAL(15, 2) NOT NULL,
    devise VARCHAR(3) NOT NULL DEFAULT 'XAF',
    statut ENUM('EN_ATTENTE', 'CONFIRMEE', 'ANNULEE', 'REFUSEE', 'TERMINEE', 'PAYEE') NOT NULL DEFAULT 'EN_ATTENTE',
    motif_refus TEXT NULL,
    stripe_payment_intent_id VARCHAR(255) NULL,
    stripe_payment_status VARCHAR(50) NULL,
    message_client TEXT NULL,
    date_confirmation DATETIME NULL,
    date_annulation DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (bien_id) REFERENCES biens(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    INDEX idx_bien (bien_id),
    INDEX idx_client (client_id),
    INDEX idx_statut (statut),
    INDEX idx_dates (date_debut, date_fin),
    INDEX idx_type (type_reservation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. TABLE CONTRATS (PDF)
-- ============================================================
CREATE TABLE contrats (
    id VARCHAR(36) PRIMARY KEY,
    reservation_id VARCHAR(36) NOT NULL UNIQUE,
    url_pdf VARCHAR(500) NOT NULL,
    public_id_cloudinary VARCHAR(255) NULL,
    type_contrat ENUM('LOCATION', 'VENTE') NOT NULL,
    date_generation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    est_signe BOOLEAN NOT NULL DEFAULT FALSE,
    date_signature_client DATETIME NULL,
    date_signature_proprietaire DATETIME NULL,
    signature_electronique BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    INDEX idx_reservation (reservation_id),
    INDEX idx_type (type_contrat)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. TABLE LOCATAIRES
-- ============================================================
CREATE TABLE locataires (
    id VARCHAR(36) PRIMARY KEY,
    bien_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    date_entree DATE NOT NULL,
    date_sortie DATE NULL,
    date_fin_prevue DATE NOT NULL,
    montant_loyer DECIMAL(15, 2) NOT NULL,
    jour_echeance INT NOT NULL COMMENT 'Jour du mois de paiement (1-31)',
    statut ENUM('ACTIF', 'ANCIEN', 'EN_RETARD') NOT NULL DEFAULT 'ACTIF',
    contrat_id VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (bien_id) REFERENCES biens(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (contrat_id) REFERENCES contrats(id) ON DELETE SET NULL,
    INDEX idx_bien (bien_id),
    INDEX idx_client (client_id),
    INDEX idx_statut (statut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. TABLE PAIEMENTS LOYERS
-- ============================================================
CREATE TABLE paiements_loyers (
    id VARCHAR(36) PRIMARY KEY,
    locataire_id VARCHAR(36) NOT NULL,
    montant DECIMAL(15, 2) NOT NULL,
    date_paiement DATETIME NOT NULL,
    mois_concerne VARCHAR(7) NOT NULL COMMENT 'Format YYYY-MM',
    annee INT NOT NULL,
    statut ENUM('PAYE', 'EN_RETARD', 'EN_ATTENTE') NOT NULL DEFAULT 'EN_ATTENTE',
    url_quittance VARCHAR(500) NULL,
    public_id_quittance VARCHAR(255) NULL,
    mode_paiement ENUM('STRIPE', 'MOMO', 'ORANGE_MONEY', 'ESPECE', 'VIREMENT') NULL,
    reference_paiement VARCHAR(255) NULL,
    commentaire TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (locataire_id) REFERENCES locataires(id) ON DELETE CASCADE,
    INDEX idx_locataire (locataire_id),
    INDEX idx_mois (mois_concerne),
    INDEX idx_statut (statut),
    INDEX idx_date (date_paiement)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. TABLE CONVERSATIONS
-- ============================================================
CREATE TABLE conversations (
    id VARCHAR(36) PRIMARY KEY,
    bien_id VARCHAR(36) NULL,
    participant_1_id VARCHAR(36) NOT NULL,
    participant_2_id VARCHAR(36) NOT NULL,
    date_creation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dernier_message_at DATETIME NULL,
    est_archive_participant_1 BOOLEAN NOT NULL DEFAULT FALSE,
    est_archive_participant_2 BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (bien_id) REFERENCES biens(id) ON DELETE SET NULL,
    FOREIGN KEY (participant_1_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (participant_2_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    INDEX idx_participants (participant_1_id, participant_2_id),
    INDEX idx_bien (bien_id),
    INDEX idx_dernier_message (dernier_message_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. TABLE MESSAGES
-- ============================================================
CREATE TABLE messages (
    id VARCHAR(36) PRIMARY KEY,
    conversation_id VARCHAR(36) NOT NULL,
    expediteur_id VARCHAR(36) NOT NULL,
    contenu TEXT NOT NULL,
    date_envoi DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    est_lu BOOLEAN NOT NULL DEFAULT FALSE,
    date_lu DATETIME NULL,
    type_message ENUM('TEXTE', 'IMAGE', 'DOCUMENT') NOT NULL DEFAULT 'TEXTE',
    url_fichier VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (expediteur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    INDEX idx_conversation (conversation_id),
    INDEX idx_expediteur (expediteur_id),
    INDEX idx_date (date_envoi),
    INDEX idx_lu (est_lu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. TABLE NOTATIONS / AVIS
-- ============================================================
CREATE TABLE notations (
    id VARCHAR(36) PRIMARY KEY,
    reservation_id VARCHAR(36) NOT NULL,
    bien_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    proprietaire_id VARCHAR(36) NOT NULL,
    note_client_pour_proprietaire INT NULL CHECK (note_client_pour_proprietaire BETWEEN 1 AND 5),
    note_proprietaire_pour_client INT NULL CHECK (note_proprietaire_pour_client BETWEEN 1 AND 5),
    commentaire_client TEXT NULL,
    commentaire_proprietaire TEXT NULL,
    date_creation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    type_operation ENUM('LOCATION', 'VENTE') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    FOREIGN KEY (bien_id) REFERENCES biens(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (proprietaire_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    INDEX idx_reservation (reservation_id),
    INDEX idx_bien (bien_id),
    INDEX idx_client (client_id),
    INDEX idx_proprietaire (proprietaire_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. TABLE FAVORIS
-- ============================================================
CREATE TABLE favoris (
    id VARCHAR(36) PRIMARY KEY,
    utilisateur_id VARCHAR(36) NOT NULL,
    bien_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (bien_id) REFERENCES biens(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favori (utilisateur_id, bien_id),
    INDEX idx_utilisateur (utilisateur_id),
    INDEX idx_bien (bien_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 15. TABLE ALERTES RECHERCHE
-- ============================================================
CREATE TABLE alertes_recherche (
    id VARCHAR(36) PRIMARY KEY,
    utilisateur_id VARCHAR(36) NOT NULL,
    nom_alerte VARCHAR(100) NOT NULL,
    ville VARCHAR(100) NULL,
    type_operation ENUM('VENTE', 'LOCATION') NULL,
    type_bien VARCHAR(100) NULL,
    prix_min DECIMAL(15, 2) NULL,
    prix_max DECIMAL(15, 2) NULL,
    surface_min DECIMAL(10, 2) NULL,
    surface_max DECIMAL(10, 2) NULL,
    est_active BOOLEAN NOT NULL DEFAULT TRUE,
    derniere_notification DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    INDEX idx_utilisateur (utilisateur_id),
    INDEX idx_active (est_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 16. TABLE OFFRES D'ACHAT
-- ============================================================
CREATE TABLE offres_achat (
    id VARCHAR(36) PRIMARY KEY,
    bien_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    montant_propose DECIMAL(15, 2) NOT NULL,
    statut ENUM('SOUMISE', 'ACCEPTEE', 'REFUSEE', 'CONTRE_PROPOSITION', 'ANNULEE') NOT NULL DEFAULT 'SOUMISE',
    message TEXT NULL,
    contre_proposition DECIMAL(15, 2) NULL,
    date_soumission DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_reponse DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (bien_id) REFERENCES biens(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    INDEX idx_bien (bien_id),
    INDEX idx_client (client_id),
    INDEX idx_statut (statut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 17. TABLE DEMANDES DE VISITE
-- ============================================================
CREATE TABLE demandes_visite (
    id VARCHAR(36) PRIMARY KEY,
    bien_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    date_souhaitee DATE NOT NULL,
    heure_souhaitee TIME NULL,
    statut ENUM('EN_ATTENTE', 'CONFIRMEE', 'REFUSEE', 'ANNULEE', 'REALISEE') NOT NULL DEFAULT 'EN_ATTENTE',
    message_client TEXT NULL,
    motif_refus TEXT NULL,
    date_confirmation DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (bien_id) REFERENCES biens(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    INDEX idx_bien (bien_id),
    INDEX idx_client (client_id),
    INDEX idx_statut (statut),
    INDEX idx_date (date_souhaitee)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 18. TABLE HISTORIQUE MODIFICATIONS (Audit Log)
-- ============================================================
CREATE TABLE historique_modifications (
    id VARCHAR(36) PRIMARY KEY,
    utilisateur_id VARCHAR(36) NULL,
    table_concernee VARCHAR(100) NOT NULL,
    enregistrement_id VARCHAR(36) NOT NULL,
    action ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    anciennes_valeurs JSON NULL,
    nouvelles_valeurs JSON NULL,
    date_modification DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE SET NULL,
    INDEX idx_utilisateur (utilisateur_id),
    INDEX idx_table (table_concernee),
    INDEX idx_date (date_modification)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 19. TABLE REFRESH TOKENS (Sécurité JWT)
-- ============================================================
CREATE TABLE refresh_tokens (
    id VARCHAR(36) PRIMARY KEY,
    utilisateur_id VARCHAR(36) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    date_expiration DATETIME NOT NULL,
    est_revoque BOOLEAN NOT NULL DEFAULT FALSE,
    date_revocation DATETIME NULL,
    ip_creation VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    INDEX idx_utilisateur (utilisateur_id),
    INDEX idx_token (token_hash),
    INDEX idx_expiration (date_expiration)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 20. TABLE SIGNALEMENTS ANNONCES
-- ============================================================
CREATE TABLE signalements (
    id VARCHAR(36) PRIMARY KEY,
    bien_id VARCHAR(36) NOT NULL,
    signalant_id VARCHAR(36) NOT NULL,
    motif ENUM('FRAUDE', 'DOUBLON', 'PRIX_INCORRECT', 'PHOTOS_FAUSSES', 'AUTRE') NOT NULL,
    description TEXT NULL,
    statut ENUM('EN_ATTENTE', 'TRAITE', 'REJETE') NOT NULL DEFAULT 'EN_ATTENTE',
    date_traitement DATETIME NULL,
    admin_traitant_id VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (bien_id) REFERENCES biens(id) ON DELETE CASCADE,
    FOREIGN KEY (signalant_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_traitant_id) REFERENCES utilisateurs(id) ON DELETE SET NULL,
    INDEX idx_bien (bien_id),
    INDEX idx_statut (statut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- VUES UTILES (Mises à jour pour la nouvelle logique)
-- ============================================================

-- Vue: Statistiques des biens par propriétaire
CREATE OR REPLACE VIEW v_stats_proprietaires AS
SELECT 
    u.id as proprietaire_id,
    u.nom,
    u.prenom,
    u.email,
    COUNT(b.id) as total_biens,
    SUM(CASE WHEN b.statut = 'PUBLIE' THEN 1 ELSE 0 END) as biens_publies,
    SUM(CASE WHEN b.type_operation = 'LOCATION' THEN 1 ELSE 0 END) as locations,
    SUM(CASE WHEN b.type_operation = 'VENTE' THEN 1 ELSE 0 END) as ventes,
    SUM(b.nb_vues) as total_vues
FROM utilisateurs u
LEFT JOIN biens b ON u.id = b.proprietaire_id
WHERE u.role = 'PRO'
GROUP BY u.id;

-- Vue: Biens disponibles en location
CREATE OR REPLACE VIEW v_biens_location_disponibles AS
SELECT 
    b.*,
    u.nom as proprietaire_nom,
    u.prenom as proprietaire_prenom,
    u.telephone as proprietaire_telephone,
    (SELECT COUNT(*) FROM photos_biens pb WHERE pb.bien_id = b.id) as nb_photos
FROM biens b
JOIN utilisateurs u ON b.proprietaire_id = u.id
WHERE b.type_operation = 'LOCATION' 
  AND b.statut = 'PUBLIE'
  AND (b.date_expiration IS NULL OR b.date_expiration > NOW());

-- Vue: Revenus mensuels par propriétaire
CREATE OR REPLACE VIEW v_revenus_mensuels AS
SELECT 
    u.id as proprietaire_id,
    u.nom,
    u.prenom,
    DATE_FORMAT(pl.date_paiement, '%Y-%m') as mois,
    COUNT(pl.id) as nb_paiements,
    SUM(pl.montant) as total_revenus
FROM utilisateurs u
JOIN locataires l ON u.id = l.client_id
JOIN paiements_loyers pl ON l.id = pl.locataire_id
WHERE pl.statut = 'PAYE'
GROUP BY u.id, mois
ORDER BY mois DESC;

-- ============================================================
-- INDEX SUPPLÉMENTAIRES POUR PERFORMANCES
-- ============================================================
CREATE INDEX idx_biens_recherche ON biens(type_operation, type_bien, ville, statut, prix);
CREATE INDEX idx_biens_geo ON biens(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX idx_reservations_dispo ON reservations(bien_id, date_debut, date_fin, statut);

-- ============================================================
-- ÉVÉNEMENT AUTOMATISÉ (Archivage des biens expirés)
-- ============================================================
DELIMITER $$
CREATE EVENT IF NOT EXISTS evt_archiver_biens_expires
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_DATE + INTERVAL 1 DAY
DO
BEGIN
    UPDATE biens 
    SET statut = 'ARCHIVE' 
    WHERE statut = 'PUBLIE' 
      AND date_expiration IS NOT NULL 
      AND date_expiration < NOW();
END$$
DELIMITER ;

-- ============================================================
-- DONNÉES DE TEST (Utilisateurs de base)
-- ============================================================
-- Mot de passe: Test1234! (hash BCrypt cost 12 généré)
INSERT INTO utilisateurs (
    id, nom, prenom, email, mot_de_passe_hash, telephone, 
    statut, role, email_verifie, date_inscription
) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'ADMIN', 'Super', 'admin@immonet.cm', 
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.XEQOwEhK5VqG0C', 
 '+237600000000', 'ACTIVE', 'ADMIN', TRUE, NOW()),
('660e8400-e29b-41d4-a716-446655440001', 'DUPONT', 'Jean', 'jean@immonet.cm', 
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.XEQOwEhK5VqG0C', 
 '+237699999999', 'ACTIVE', 'CLIENT', TRUE, NOW()),
('770e8400-e29b-41d4-a716-446655440002', 'MARTIN', 'Paul', 'paul@immonet.cm', 
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.XEQOwEhK5VqG0C', 
 '+237688888888', 'ACTIVE', 'PRO', TRUE, NOW());

-- ============================================================
-- VÉRIFICATION FINALE
-- ============================================================
SELECT 
    COUNT(*) as nombre_tables,
    TABLE_SCHEMA as base_de_donnees
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'immonet_db' 
  AND TABLE_TYPE = 'BASE TABLE';

SELECT 
    table_schema as 'Base de données',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Taille (MB)'
FROM information_schema.tables 
WHERE table_schema = 'immonet_db'
GROUP BY table_schema;
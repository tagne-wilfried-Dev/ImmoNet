
-- module d'authentification et gestion des utilisateurs

-- table utilisateurs

CREATE TABLE utilisateurs (
    id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',--
    nom VARCHAR(100) NOT NULL,--
    prenom VARCHAR(100) NOT NULL,--
    email VARCHAR(255) NOT NULL UNIQUE,--
    mot_de_passe_hash VARCHAR(255) NOT NULL COMMENT 'BCrypt',--
    telephone VARCHAR(20) NOT NULL,--
    date_inscription DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,--
    dernier_login DATETIME NULL,
    statut ENUM('ACTIVE','SUSPENDED', 'BANNED') NOT NULL DEFAULT 'ACTIVE',
    role ENUM('VISITEUR','CLIENT', 'PRO', 'ADMIN') NOT NULL DEFAULT 'CLIENT',--
    email_verifie BOOLEAN NOT NULL DEFAULT FALSE,
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

-- table abonnements pro

CREATE TABLE abonnements_pro (
    id VARCHAR(36) PRIMARY KEY,
    utilisateur_id VARCHAR(36) NOT NULL,
    type_abonnement ENUM('STARTER', 'BUSINESS', 'PREMIUM') NOT NULL,
    date_debut DATETIME NOT NULL,
    stripe_subscription_id VARCHAR(255) NULL,
    stripe_payment_id VARCHAR(255) NULL,
    actif BOOLEAN NOT NULL DEFAULT FALSE,
    montant_paye INT NOT NULL,
    devise VARCHAR(3) NOT NULL DEFAULT 'XAF',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    INDEX idx_utilisateur (utilisateur_id),
    INDEX idx_actif (actif)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
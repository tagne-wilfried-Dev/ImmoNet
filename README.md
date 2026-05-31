# ImmoNet - Plateforme Immobilière Complète

**Version**: 0.0.1-SNAPSHOT  
**Date de mise à jour**: 31 Mai 2026  
**Responsable du projet**: tagne-wilfried-Dev

---

## 📋 Vue d'ensemble du projet

ImmoNet est une **plateforme immobilière complète** destinée à :
- ✅ Gérer les biens immobiliers des propriétaires
- ✅ Servir de point de rencontre entre l'offre et la demande immobilière
- ✅ Faciliter les transactions et communications entre acteurs

### Composition du code
| Langage | Pourcentage | Description |
|---------|------------|------------|
| TypeScript | 61.2% | Frontend React avec Vite |
| Java | 35% | Backend Spring Boot |
| CSS | 3.3% | Styling Tailwind CSS |
| Autres | 0.5% | Configuration, assets |

---

## 🏗️ Architecture générale

### Stack technologique

#### **Frontend (61.2% - TypeScript/React)**
```
React 19.2.6 + TypeScript 6.0.2 + Vite 8.0.12
├── State Management: Redux Toolkit
├── Form Management: React Hook Form + Zod validation
├── UI Components: Shadcn UI + Tailwind CSS 4.3
├── Maps: React Leaflet + Google Maps API
├── Charts: Recharts 3.8.1
├── HTTP Client: Axios 1.16.1
├── Animations: Framer Motion 12.40.0
└── Routing: React Router DOM 7.15.0
```

#### **Backend (35% - Java)**
```
Spring Boot 4.0.6 + Java 17
├── Security: Spring Security + JWT (JJWT 0.13.0)
├── Database: Spring Data JPA + Hibernate
├── ORM Mapper: MapStruct 1.6.3
├── Mail Service: Spring Mail
├── Payment: Razorpay + Stripe APIs
├── API Docs: SpringDoc OpenAPI Swagger
└── WebSocket: Java-WebSocket 1.6.0
```

#### **Database**
- **Primary**: MySQL 8.0+
- **ORM**: Hibernate avec Spring Data JPA

---

## 📁 Structure du projet

### Frontend

```
frontend/
├── src/
│   ├── assets/                 # Images, fonts, ressources statiques
│   ├── components/             # Composants réutilisables
│   │   ├── common/            # Navbar, Footer, Layout
│   │   ├── forms/             # Formulaires (Login, Register, etc.)
│   │   ├── cards/             # Composants cards
│   │   └── ui/                # Composants UI primitifs
│   ├── lib/                    # Utilitaires et helpers
│   │   ├── api.ts             # Configuration Axios
│   │   ├── validators.ts       # Validations Zod
│   │   └── utils.ts            # Fonctions utilitaires
│   ├── pages/                  # Pages principales
│   │   ├── basePages/
│   │   │   ├── Home.tsx       # Accueil
│   │   │   ├── NotFoundPage.tsx
│   │   │   └── Sitemap.tsx
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ForgotPassword.tsx
│   │   └── proprietaire/
│   │       ├── DashboardPage.tsx
│   │       ├── AnnoncesPage.tsx
│   │       ├── ReservationsPage.tsx
│   │       ├── MessagesPage.tsx
│   │       ├── TransactionsPage.tsx
│   │       ├── ValidationsPage.tsx
│   │       ├── CataloguesPage.tsx
│   │       └── CreateAnnoncePage.tsx
│   ├── store/                  # Redux Slices
│   │   ├── authSlice.ts       # State authentification
│   │   ├── propertySlice.ts   # State propriétés
│   │   ├── reservationSlice.ts # State réservations
│   │   └── store.ts            # Configuration Redux
│   ├── types/                  # Types TypeScript
│   │   ├── auth.ts
│   │   ├── property.ts
│   │   ├── user.ts
│   │   └── common.ts
│   ├── App.tsx                 # Composant racine + Routes
│   ├── index.css               # Styles globaux Tailwind
│   ├── main.tsx                # Point d'entrée
│   └── vite-env.d.ts           # Types Vite
├── package.json                # Dépendances npm
├── vite.config.ts              # Configuration Vite
├── tsconfig.json               # Configuration TypeScript
├── tailwind.config.js          # Configuration Tailwind
├── eslint.config.js            # Configuration ESLint
└── .env.local                  # Variables d'environnement
```

### Backend

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/immoteam/
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── PropertyController.java
│   │   │   │   ├── ReservationController.java
│   │   │   │   ├── UserController.java
│   │   │   │   └── PaymentController.java
│   │   │   ├── service/
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── PropertyService.java
│   │   │   │   ├── ReservationService.java
│   │   │   │   ├── UserService.java
│   │   │   │   ├── EmailService.java
│   │   │   │   └── PaymentService.java
│   │   │   ├── model/
│   │   │   │   ├── User.java
│   │   │   │   ├── Property.java
│   │   │   │   ├── Reservation.java
│   │   │   │   ├── Review.java
│   │   │   │   ├── Payment.java
│   │   │   │   └── Message.java
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── PropertyRepository.java
│   │   │   │   ├── ReservationRepository.java
│   │   │   │   └── MessageRepository.java
│   │   │   ├── security/
│   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   ├── CustomUserDetailsService.java
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── dto/
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   ├── PropertyDTO.java
│   │   │   │   └── ReservationDTO.java
│   │   │   ├── exception/
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   └── ValidationException.java
│   │   │   ├── config/
│   │   │   │   ├── CorsConfig.java
│   │   │   │   ├── OpenApiConfig.java
│   │   │   │   └── WebSocketConfig.java
│   │   │   ├── mapper/
│   │   │   │   ├── UserMapper.java
│   │   │   │   ├── PropertyMapper.java
│   │   │   │   └── ReservationMapper.java
│   │   │   └── ImmoteamApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       ├── application-prod.properties
│   │       └── db/migration/
│   │           └── V1__Initial_schema.sql
│   └── test/
│       └── java/com/immoteam/
│           ├── service/
│           │   ├── AuthServiceTest.java
│           │   ├── PropertyServiceTest.java
│           │   └── UserServiceTest.java
│           └── controller/
│               ├── AuthControllerTest.java
│               └── PropertyControllerTest.java
├── pom.xml                     # Configuration Maven
├── .gitignore                  # Fichiers ignorés
└── README_BACKEND.md           # Documentation backend
```

---

## 🔑 Fonctionnalités principales

### 1. **Authentification & Autorisation**
- ✅ Inscription (Signup) avec validation d'email
- ✅ Connexion (Login) sécurisée
- ✅ JWT (JSON Web Tokens) pour la gestion de session
- ✅ Refresh tokens pour la durée de vie prolongée
- ✅ CORS configuré pour la communication frontend/backend
- ✅ Spring Security avec authentification formelle

**Endpoints disponibles:**
```
POST   /api/auth/signup          - Créer un nouveau compte
POST   /api/auth/login           - Se connecter
POST   /api/auth/logout          - Se déconnecter
POST   /api/auth/refresh         - Rafraîchir le token
GET    /api/auth/verify          - Vérifier l'email
POST   /api/auth/forgot-password - Réinitialiser le mot de passe
```

### 2. **Gestion des propriétés (Annonces)**
- ✅ Création/Édition/Suppression d'annonces
- ✅ Upload d'images multiples
- ✅ Galerie photo intégrée
- ✅ Localisation avec Leaflet maps
- ✅ Détails complets (surface, type, prix, commodités)

**Endpoints:**
```
GET    /api/properties           - Lister toutes les propriétés
GET    /api/properties/{id}      - Détails d'une propriété
POST   /api/properties           - Créer une annonce (propriétaire)
PUT    /api/properties/{id}      - Modifier une annonce
DELETE /api/properties/{id}      - Supprimer une annonce
GET    /api/properties/search    - Recherche avancée
```

### 3. **Système de réservation**
- ✅ Calendrier de disponibilité
- ✅ Gestion des réservations
- ✅ Statuts: Pending, Confirmed, Cancelled
- ✅ Système de confirmation/annulation

**Endpoints:**
```
POST   /api/reservations         - Créer une réservation
GET    /api/reservations         - Mes réservations
PUT    /api/reservations/{id}    - Modifier une réservation
DELETE /api/reservations/{id}    - Annuler une réservation
PUT    /api/reservations/{id}/confirm - Confirmer une réservation
```

### 4. **Système de paiement**
- ✅ Intégration Stripe
- ✅ Intégration Razorpay
- ✅ Historique des transactions
- ✅ Statuts de paiement (Pending, Completed, Failed)

**Endpoints:**
```
POST   /api/payments/stripe      - Créer un paiement Stripe
POST   /api/payments/razorpay    - Créer un paiement Razorpay
GET    /api/payments/history     - Historique des transactions
GET    /api/payments/{id}        - Détails d'une transaction
```

### 5. **Messagerie interne**
- ✅ Messages directs entre utilisateurs
- ✅ WebSocket pour chat en temps réel
- ✅ Notifications push
- ✅ Historique des conversations

**Endpoints:**
```
POST   /api/messages             - Envoyer un message
GET    /api/messages/{userId}    - Historique de conversation
GET    /api/messages/inbox       - Boîte de réception
DELETE /api/messages/{id}        - Supprimer un message

WS     /ws/chat                  - WebSocket chat en temps réel
```

### 6. **Dashboard propriétaire**
- ✅ Vue globale de toutes les annonces
- ✅ Statistiques (réservations, revenus, avis)
- ✅ Graphiques de performance
- ✅ Gestion des avis et ratings
- ✅ Système de validation des propriétés

### 7. **Recherche et filtrage**
- ✅ Recherche full-text
- ✅ Filtres avancés (prix, localisation, type, commodités)
- ✅ Tri (date, prix, popularité)
- ✅ Pagination

---

## 🚀 Guide de démarrage rapide

### Prérequis
```bash
Node.js 18+
Java 17+
Maven 3.8+
MySQL 8.0+
Git
```

### Installation Frontend

```bash
# 1. Cloner le repository
git clone https://github.com/tagne-wilfried-Dev/ImmoNet.git
cd ImmoNet/frontend

# 2. Installer les dépendances
npm install

# 3. Configuration d'environnement
cat > .env.local << EOF
VITE_API_URL=http://localhost:8080/api
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
VITE_APP_NAME=ImmoNet
EOF

# 4. Démarrer le serveur de développement
npm run dev

# 5. Accéder à l'application
# http://localhost:5173
```

### Installation Backend

```bash
# 1. Accéder au répertoire backend
cd backend

# 2. Configuration MySQL
mysql -u root -p
CREATE DATABASE immonet;
USE immonet;

# 3. Configuration application.properties
cat > src/main/resources/application.properties << EOF
spring.application.name=ImmoNet
spring.datasource.url=jdbc:mysql://localhost:3306/immonet
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# JWT
jwt.secret=your_super_secret_key_min_32_characters_long_required
jwt.expiration=86400000

# Server
server.port=8080
server.servlet.context-path=/api
EOF

# 4. Compiler et exécuter
mvn clean install
mvn spring-boot:run

# 5. Accéder à la documentation API Swagger
# http://localhost:8080/api/swagger-ui.html
```

---

## 🔧 Configuration détaillée

### Frontend - Variables d'environnement (.env.local)

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_key_here

# Firebase (optional)
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id

# Application
VITE_APP_NAME=ImmoNet
VITE_APP_VERSION=0.0.1
VITE_ENVIRONMENT=development
```

### Backend - Configuration Spring

**Properties principaux:**
```properties
# Datasource
spring.datasource.url=jdbc:mysql://localhost:3306/immonet
spring.datasource.username=root
spring.datasource.password=password

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Mail
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# JWT
jwt.secret=your_secret_key_min_32_chars_long
jwt.expiration=86400000
jwt.refresh-expiration=604800000

# Stripe & Razorpay
stripe.api.key=sk_test_...
razorpay.key.id=rzp_test_...
razorpay.key.secret=...
```

---

## 📊 Workflow de l'application

### Flux d'authentification
```
1. Utilisateur remplit le formulaire de signup
   ↓
2. Frontend envoie les données à /api/auth/signup
   ↓
3. Backend valide les données
   ↓
4. Backend hache le mot de passe (BCrypt)
   ↓
5. Backend crée l'utilisateur en DB
   ↓
6. Backend envoie l'email de confirmation
   ↓
7. Frontend redirige vers /login
   ↓
8. Utilisateur se connecte
   ↓
9. Backend génère JWT + Refresh Token
   ↓
10. Frontend stocke les tokens (localStorage/sessionStorage)
   ↓
11. Utilisateur redirigé vers le dashboard
```

### Flux de publication d'annonce
```
1. Propriétaire clique sur "Publier une annonce"
   ↓
2. Formulaire avec validation (React Hook Form + Zod)
   ↓
3. Upload d'images (multipart/form-data)
   ↓
4. Localisation sur la carte Leaflet
   ↓
5. Soumission à POST /api/properties
   ↓
6. Backend valide et crée la propriété
   ↓
7. Propriété en attente de validation (admin)
   ↓
8. Admin valide → Propriété publiée
   ↓
9. Propriété visible aux utilisateurs
```

---

## 🧪 Tests

### Frontend
```bash
cd frontend

# Tests unitaires
npm run test

# Couverture de code
npm run test:coverage

# Tests E2E (Playwright/Cypress)
npm run test:e2e
```

### Backend
```bash
cd backend

# Tests unitaires
mvn test

# Tests d'intégration
mvn verify

# Couverture (JaCoCo)
mvn jacoco:report
```

---

## 📦 Dépendances principales

### Frontend - NPM

| Package | Version | Utilisation |
|---------|---------|-------------|
| react | 19.2.6 | Framework UI |
| react-router-dom | 7.15.0 | Routage |
| @reduxjs/toolkit | 2.12.0 | State management |
| react-hook-form | 7.76.1 | Gestion formulaires |
| zod | 4.4.3 | Validation schemas |
| tailwindcss | 4.3.0 | Styling CSS |
| shadcn | 4.7.0 | Composants UI |
| axios | 1.16.1 | HTTP client |
| leaflet | 1.9.4 | Cartes |
| recharts | 3.8.1 | Graphiques |
| framer-motion | 12.40.0 | Animations |

### Backend - Maven

| Dépendance | Version | Utilisation |
|-----------|---------|-------------|
| spring-boot-starter-web | 4.0.6 | REST API |
| spring-boot-starter-security | 4.0.6 | Authentification |
| spring-boot-starter-data-jpa | 4.0.6 | ORM |
| jjwt | 0.13.0 | JWT |
| mysql-connector-j | 8.x | Driver MySQL |
| mapstruct | 1.6.3 | DTO Mapping |
| razorpay-java | 1.4.8 | Payment |
| stripe-java | 32.2.0 | Payment |
| Java-WebSocket | 1.6.0 | WebSocket |

---

## 🐛 Dépannage courant

### Frontend

**Le frontend ne peut pas atteindre le backend (CORS)**
```bash
# Vérifier que le backend est en cours d'exécution
curl -i http://localhost:8080/api/health

# Vérifier la configuration VITE_API_URL
cat .env.local

# Vérifier la console du navigateur pour les erreurs CORS
```

**Port 5173 déjà utilisé**
```bash
# Changer le port dans vite.config.ts
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### Backend

**Erreur de connexion MySQL**
```bash
# Vérifier que MySQL est en cours d'exécution
mysql -u root -p -e "SELECT VERSION();"

# Vérifier la base de données existe
mysql -u root -p -e "SHOW DATABASES;"

# Créer la DB si nécessaire
mysql -u root -p -e "CREATE DATABASE immonet;"
```

**Port 8080 déjà utilisé**
```properties
# Changer dans application.properties
server.port=9090
```

---

## 📖 Documentation supplémentaire

- **[SETUP.md](./SETUP.md)** - Guide d'installation détaillé
- **[FEATURE_LOGIN_SIGNUP.md](./FEATURE_LOGIN_SIGNUP.md)** - Documentation login/signup
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Endpoints API (à créer)
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Guide de contribution (à créer)

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Veuillez :

1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committer vos changements (`git commit -m 'Add AmazingFeature'`)
4. Pousser vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

**Standards de code:**
- ✅ Utiliser TypeScript pour le frontend
- ✅ Suivre les conventions Java pour le backend
- ✅ Écrire des tests pour chaque feature
- ✅ Documenter les changements significatifs
- ✅ Respecter le formatage ESLint/Prettier

---

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 Auteur

**tagne-wilfried-Dev**  
Email: tagne.wilfried@example.com  
GitHub: [@tagne-wilfried-Dev](https://github.com/tagne-wilfried-Dev)

---

## 📞 Support

Pour toute question ou problème :
1. Vérifier la documentation existante
2. Ouvrir une [issue GitHub](https://github.com/tagne-wilfried-Dev/ImmoNet/issues)
3. Consulter la [documentation API](./API_DOCUMENTATION.md)

---

**Dernière mise à jour**: 31 Mai 2026  
**Status**: 🚧 En développement actif

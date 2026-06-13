import type { PropertySummary } from '@/lib/types/property.types';

export const MOCK_PROPERTIES: PropertySummary[] = [
  {
    id: 1,
    titre: 'Villa moderne avec piscine – Bastos',
    typeOperation: 'VENTE',
    typeBien: 'VILLA',
    statut: 'PUBLIE',
    prix: 185000000,
    surface: 320,
    nbPieces: 7,
    nbChambres: 4,
    nbSallesDeBain: 3,
    photos: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    ],
    localisation: {
      pays: 'CM',
      ville: 'Yaoundé',
      quartier: 'Bastos',
    },
    proprietaire: {
      id: 'pro-001',
      nom: 'Kamga Immobilier',
      badgePro: true,
    },
    createdAt: '2025-01-10T08:00:00Z',
  },
  
  {
    id: 'prop-002',
    titre: 'Appartement standing – Bonapriso, vue mer',
    typeOperation: 'LOCATION',
    typeBien: 'APPARTEMENT',
    statut: 'PUBLIE',
    prix: 350000,
    surface: 95,
    nbPieces: 4,
    nbChambres: 2,
    nbSallesDeBain: 2,
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    ],
    localisation: {
      pays: 'CM',
      ville: 'Douala',
      quartier: 'Bonapriso',
    },
    proprietaire: {
      id: 'pro-002',
      nom: 'Tchoumi & Associés',
      badgePro: true,
    },
    createdAt: '2025-01-08T10:00:00Z',
  },
  {
    id: 'prop-003',
    titre: 'Maison familiale 5 pièces – Omnisport',
    typeOperation: 'VENTE',
    typeBien: 'MAISON',
    statut: 'PUBLIE',
    prix: 75000000,
    surface: 180,
    nbPieces: 5,
    nbChambres: 3,
    nbSallesDeBain: 2,
    photos: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    ],
    localisation: {
      pays: 'CM',
      ville: 'Yaoundé',
      quartier: 'Omnisport',
    },
    proprietaire: {
      id: 'pro-003',
      nom: 'Ndongo Properties',
      badgePro: false,
    },
    createdAt: '2025-01-05T09:00:00Z',
  },
  {
    id: 'prop-004',
    titre: 'Studio meublé tout confort – Akwa',
    typeOperation: 'LOCATION',
    typeBien: 'STUDIO',
    statut: 'PUBLIE',
    prix: 120000,
    surface: 35,
    nbPieces: 1,
    nbChambres: 1,
    nbSallesDeBain: 1,
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    ],
    localisation: {
      pays: 'CM',
      ville: 'Douala',
      quartier: 'Akwa',
    },
    proprietaire: {
      id: 'pro-004',
      nom: 'Bello Gestion',
      badgePro: true,
    },
    createdAt: '2025-01-12T11:00:00Z',
  },
];

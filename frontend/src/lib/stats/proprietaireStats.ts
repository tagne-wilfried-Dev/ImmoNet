import type { PropertySummary } from '@/lib/types/property.types';

// Quotas d'annonces publiables par formule (alignés sur AbonnementService backend)
export const QUOTAS_ABONNEMENT: Record<string, number> = {
  GRATUIT: 3,
  STARTER: 10,
  BUSINESS: 20,
  PREMIUM: 40,
};

const STATUT_LABELS: Record<string, string> = {
  BROUILLON: 'Brouillon',
  EN_ATTENTE: 'En attente',
  PUBLIE: 'Publié',
  EN_LOCATION: 'En location',
  VENDU: 'Vendu',
  ARCHIVE: 'Archivé',
  SUSPENDU: 'Suspendu',
};

const TYPE_LABELS: Record<string, string> = {
  APPARTEMENT: 'Appartement',
  APPARTEMENT_MEUBLEE: 'Appart. meublé',
  MAISON: 'Maison',
  VILLA: 'Villa',
  STUDIO: 'Studio',
  TERRAIN: 'Terrain',
  BUREAU: 'Bureau',
  LOCAL_COMMERCIAL: 'Local comm.',
};

export interface ChartDatum {
  name: string;
  value: number;
  key: string;
}

export interface QuotaInfo {
  publies: number;
  quota: number;
  restant: number;
  plan: string;
}

/** Compte les biens par statut, pour le donut de répartition du patrimoine. */
export function aggregateByStatut(biens: PropertySummary[]): ChartDatum[] {
  const counts = new Map<string, number>();
  for (const b of biens) {
    counts.set(b.statut, (counts.get(b.statut) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([key, value]) => ({
    key,
    name: STATUT_LABELS[key] ?? key,
    value,
  }));
}

/** Compte les biens par type, pour le bar chart de composition du portefeuille. */
export function aggregateByType(biens: PropertySummary[]): ChartDatum[] {
  const counts = new Map<string, number>();
  for (const b of biens) {
    counts.set(b.typeBien, (counts.get(b.typeBien) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([key, value]) => ({ key, name: TYPE_LABELS[key] ?? key, value }))
    .sort((a, b) => b.value - a.value);
}

/** Calcule l'utilisation du quota d'abonnement (annonces publiées / quota du plan). */
export function computeQuota(biens: PropertySummary[], plan?: string): QuotaInfo {
  const resolvedPlan = plan ?? 'GRATUIT';
  const quota = QUOTAS_ABONNEMENT[resolvedPlan] ?? 0;
  const publies = biens.filter((b) => b.statut === 'PUBLIE').length;
  return {
    publies,
    quota,
    restant: Math.max(0, quota - publies),
    plan: resolvedPlan,
  };
}

/** Total des vues cumulées sur l'ensemble du patrimoine. */
export function totalVues(biens: PropertySummary[]): number {
  return biens.reduce((sum, b) => sum + (b.nbVues ?? 0), 0);
}

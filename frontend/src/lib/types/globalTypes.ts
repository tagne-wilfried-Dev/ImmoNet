import { Building2, ShieldCheck, HomeIcon } from "lucide-react";
import type { OperationType, PropertyType } from "./property.types";

export interface QuickSearchState {
  typeOperation: OperationType;
  pays: string;
  ville: string;
  typeBien: PropertyType | '';
}

// ─── Données statiques ────────────────────────────────────────────────────────

export const STATS = [
  { value: '12 400+', label: 'Biens disponibles', icon: Building2 },
  { value: '3 800+', label: 'Propriétaires vérifiés', icon: ShieldCheck },
  { value: '28 000+', label: 'Familles logées', icon: HomeIcon },
] as const;

export const VILLES_CM = ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Maroua', 'Bamenda'];

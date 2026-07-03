import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MEDIA_BASE_URL } from "./apiConfig"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Retourne l'URL complète d'un média (photo, avatar).
 * Si l'URL commence par /uploads, on ajoute le préfixe du backend.
 * Si l'URL est déjà complète (http...), on la retourne telle quelle.
 */
export function getMediaUrl(url: string | undefined | null): string {
  if (!url) return '';
  
  if (url.startsWith('http')) {
    return url;
  }
  
  if (url.startsWith('/uploads')) {
    return `${MEDIA_BASE_URL}${url}`;
  }
  
  return url;
}

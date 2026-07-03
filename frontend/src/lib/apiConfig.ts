// Résolution centralisée de l'URL du backend.
//
// Par défaut, l'adresse est DÉDUITE de l'hôte courant du navigateur :
//   - front ouvert sur http://localhost:5173      -> API http://localhost:5000/api
//   - front ouvert sur http://192.168.51.177:5173 -> API http://192.168.51.177:5000/api
// => Aucune modification à faire pour tester depuis un téléphone / autre PC du même Wi-Fi,
//    même si l'IP de la machine change (DHCP).
//
// `VITE_API_URL` reste un override optionnel (utile en production, ou si le backend
// n'est pas sur le port 5000 de la même machine que le front).

const BACKEND_PORT = 5000;

function resolveApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // Dérivation automatique depuis l'hôte servant le frontend.
  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:${BACKEND_PORT}/api`;
}

/** Base des appels API, ex: http://192.168.51.177:5000/api */
export const API_BASE_URL = resolveApiBaseUrl();

/** Base des médias (sans le suffixe /api), ex: http://192.168.51.177:5000 */
export const MEDIA_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

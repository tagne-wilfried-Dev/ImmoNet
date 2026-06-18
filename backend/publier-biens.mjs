// Script de publication des annonces ImmoNet.
// Récupère tous les biens du PRO connecté et passe les BROUILLON en PUBLIE.
// Usage : node publier-biens.mjs
// Variables d'env optionnelles : API_URL, SEED_EMAIL, SEED_PASSWORD
// Nécessite Node 18+ (fetch intégré).

const API_URL = process.env.API_URL ?? "http://localhost:5000/api";
const EMAIL = process.env.SEED_EMAIL ?? "user@mail.com";
const PASSWORD = process.env.SEED_PASSWORD ?? "password";

async function login() {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, motDePasse: PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(`Login échoué (${res.status}) : ${await res.text()}`);
  }
  const data = await res.json();
  if (!data.accessToken) throw new Error("Pas de accessToken dans la réponse de login.");
  console.log(`Connecté en tant que ${EMAIL} (role ${data.role}).`);
  return data.accessToken;
}

// Récupère tous les biens du propriétaire en parcourant toutes les pages.
async function fetchAllMine(token) {
  const all = [];
  let page = 0;
  let totalPages = 1;
  do {
    const res = await fetch(`${API_URL}/biens/mine?page=${page}&size=50`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`GET /biens/mine échoué (${res.status}) : ${await res.text()}`);
    const data = await res.json();
    all.push(...(data.content ?? []));
    totalPages = data.totalPages ?? 1;
    page++;
  } while (page < totalPages);
  return all;
}

async function publier(token, bien, index, total) {
  const url = `${API_URL}/biens/${bien.id}/statut?statut=PUBLIE`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  const label = `[${index + 1}/${total}] #${bien.id} ${bien.titre}`;
  if (!res.ok) {
    const txt = await res.text();
    // Le backend renvoie une erreur quand le quota est atteint.
    const quotaAtteint = /quota|limit|abonnement|publier/i.test(txt);
    console.error(`  ✗ ${label} — ${res.status} : ${txt}`);
    return { ok: false, quotaAtteint };
  }
  console.log(`  ✓ ${label} → PUBLIE`);
  return { ok: true };
}

async function main() {
  console.log(`Cible API : ${API_URL}\n`);
  const token = await login();

  const biens = await fetchAllMine(token);
  const brouillons = biens.filter((b) => b.statut === "BROUILLON");
  console.log(`\n${biens.length} biens au total, dont ${brouillons.length} en BROUILLON à publier.\n`);

  if (brouillons.length === 0) {
    console.log("Rien à publier.");
    return;
  }

  let ok = 0;
  for (let i = 0; i < brouillons.length; i++) {
    const res = await publier(token, brouillons[i], i, brouillons.length);
    if (res.ok) {
      ok++;
    } else if (res.quotaAtteint) {
      console.warn(
        `\n⚠ Quota d'abonnement atteint après ${ok} publication(s). ` +
        `Les biens restants demeurent en BROUILLON.`
      );
      break;
    }
  }

  console.log(`\nTerminé : ${ok}/${brouillons.length} biens publiés.`);
}

main().catch((err) => {
  console.error("\nErreur fatale :", err.message);
  process.exitCode = 1;
});

// Script de seed des annonces ImmoNet.
// Usage : node seed-biens.mjs
// Variables d'env optionnelles : API_URL, SEED_EMAIL, SEED_PASSWORD, SEED_FILE
// Nécessite Node 18+ (fetch intégré).

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_URL = process.env.API_URL ?? "http://localhost:5000/api";
const EMAIL = process.env.SEED_EMAIL ?? "user@mail.com";
const PASSWORD = process.env.SEED_PASSWORD ?? "userpassword";
const SEED_FILE = process.env.SEED_FILE ?? join(__dirname, "seed-biens-user2.json");

async function login() {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, motDePasse: PASSWORD }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Login échoué (${res.status}) : ${txt}`);
  }
  const data = await res.json();
  if (!data.accessToken) throw new Error("Pas de accessToken dans la réponse de login.");
  console.log(`Connecté en tant que ${EMAIL} (role ${data.role}).`);
  return data.accessToken;
}

async function createBien(token, bien, index, total) {
  const res = await fetch(`${API_URL}/biens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bien),
  });
  const label = `[${index + 1}/${total}] ${bien.titre}`;
  if (!res.ok) {
    const txt = await res.text();
    console.error(`  ✗ ${label} — ${res.status} : ${txt}`);
    return false;
  }
  console.log(`  ✓ ${label}`);
  return true;
}

async function main() {
  const raw = await readFile(SEED_FILE, "utf-8");
  const biens = JSON.parse(raw);
  console.log(`${biens.length} annonces à créer depuis ${SEED_FILE}`);
  console.log(`Cible API : ${API_URL}\n`);

  const token = await login();
  console.log("");

  let ok = 0;
  for (let i = 0; i < biens.length; i++) {
    const success = await createBien(token, biens[i], i, biens.length);
    if (success) ok++;
  }

  console.log(`\nTerminé : ${ok}/${biens.length} annonces créées.`);
  if (ok < biens.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error("\nErreur fatale :", err.message);
  process.exitCode = 1;
});

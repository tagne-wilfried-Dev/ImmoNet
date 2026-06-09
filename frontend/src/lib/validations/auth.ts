import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  motDePasse: z.string().min(1, 'Mot de passe requis'),
});

// Valeurs strictement alignées sur les rôles backend Spring Boot
export const ROLES = ['CLIENT', 'PROPRIETAIRE'] as const;
export type Role = (typeof ROLES)[number];

export const registerSchema = z
  .object({
    nom: z.string().min(2, 'Nom requis (min. 2 caractères)'),
    prenom: z.string().min(2, 'Prénom requis (min. 2 caractères)'),
    email: z.string().email('Adresse email invalide'),
    telephone: z
      .string()
      .regex(/^\+?\d{9,15}$/, 'Numéro invalide (ex : +2376XXXXXXXX)'),
    motDePasse: z
      .string()
      .min(8, 'Minimum 8 caractères')
      .regex(/[A-Z]/, 'Au moins une majuscule')
      .regex(/[0-9]/, 'Au moins un chiffre'),
    confirmPass: z.string(),
    role: z.enum(ROLES, { message: 'Sélectionnez un rôle' }),
    // Champs optionnels — omis du payload si vides grâce au transform en bas
    ville: z.string().max(100).optional(),
    pays: z.string().max(100).optional(),
    acceptTerms: z.literal(true, { message: 'Vous devez accepter les CGU' }),
  })
  .refine((data) => data.motDePasse === data.confirmPass, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPass'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// Type du payload envoyé au backend — sans les champs purement frontend
export type RegisterPayload = Omit<RegisterFormData, 'confirmPass' | 'acceptTerms'>;

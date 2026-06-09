import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Globe,
  CheckSquare,
  Square,
  UserCheck,
  Home,
} from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import MessageAlert from '@/components/ui/MessageAlert';
import {
  registerSchema,
  type RegisterFormData,
  type RegisterPayload,
} from '@/lib/validations/auth';
import axios from '@/lib/axios';

// ─── Sous-composant : sélecteur de rôle ──────────────────────────────────────

interface RoleOption {
  value: 'CLIENT' | 'PROPRIETAIRE';
  label: string;
  description: string;
  Icon: React.ElementType;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: 'CLIENT',
    label: 'Client',
    description: 'Rechercher et louer / acheter un bien',
    Icon: UserCheck,
  },
  {
    value: 'PROPRIETAIRE',
    label: 'Propriétaire',
    description: 'Publier et gérer mes annonces (abonnement requis)',
    Icon: Home,
  },
];

interface RoleSelectorProps {
  value: 'CLIENT' | 'PROPRIETAIRE' | undefined;
  onChange: (role: 'CLIENT' | 'PROPRIETAIRE') => void;
  error?: string;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ value, onChange, error }) => (
  <div className="space-y-1.5">
    <p className="block text-xs font-medium text-[#a5f3fc]/80 tracking-wide uppercase">
      Je suis un…
    </p>
    <div className="grid grid-cols-2 gap-3">
      {ROLE_OPTIONS.map(({ value: roleValue, label, description, Icon }) => {
        const isSelected = value === roleValue;
        return (
          <button
            key={roleValue}
            type="button"
            onClick={() => onChange(roleValue)}
            className={`
              relative flex flex-col items-start gap-1.5 p-3.5 rounded-xl border text-left
              transition-all duration-150
              ${
                isSelected
                  ? 'border-[#22d3ee] bg-[rgba(34,211,238,0.08)] shadow-[0_0_0_1px_rgba(34,211,238,0.3)]'
                  : 'border-[rgba(34,211,238,0.15)] bg-[rgba(4,47,61,0.4)] hover:border-[rgba(34,211,238,0.3)] hover:bg-[rgba(34,211,238,0.04)]'
              }
            `}
            aria-pressed={isSelected}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150 ${
                isSelected
                  ? 'bg-[rgba(34,211,238,0.2)] text-[#22d3ee]'
                  : 'bg-[rgba(255,255,255,0.05)] text-[#64748b]'
              }`}
            >
              <Icon size={15} aria-hidden="true" />
            </div>
            <div>
              <p
                className={`text-sm font-medium transition-colors duration-150 ${
                  isSelected ? 'text-[#a5f3fc]' : 'text-[#94a3b8]'
                }`}
              >
                {label}
              </p>
              <p className="text-[10px] text-[#475569] leading-relaxed mt-0.5">{description}</p>
            </div>
            {/* Indicateur sélectionné */}
            {isSelected && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#22d3ee] shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
            )}
          </button>
        );
      })}
    </div>
    {error && (
      <p className="text-xs text-[#ef4444] mt-1" role="alert">
        {error}
      </p>
    )}
  </div>
);

// ─── Séparateur de section ────────────────────────────────────────────────────

const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
  <div className="relative flex items-center gap-3 py-1">
    <div className="flex-1 border-t border-[rgba(34,211,238,0.08)]" />
    <span className="text-[10px] font-medium text-[#334155] uppercase tracking-widest whitespace-nowrap">
      {label}
    </span>
    <div className="flex-1 border-t border-[rgba(34,211,238,0.08)]" />
  </div>
);

// ─── Page principale ──────────────────────────────────────────────────────────

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      acceptTerms: false as unknown as true,
      role: undefined,
      ville: '',
      pays: '',
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const acceptTerms = watch('acceptTerms');
  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setError('');

    // Construction du payload — on retire les champs purement frontend
    // et on omet ville/pays s'ils sont vides
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPass: _unused, acceptTerms: _terms, ville, pays, ...rest } = data;
    const payload: RegisterPayload = {
      ...rest,
      ...(ville?.trim() ? { ville: ville.trim() } : {}),
      ...(pays?.trim() ? { pays: pays.trim() } : {}),
    };

    try {
      const response = await axios.post('/auth/register', payload);
      if (response.status === 200 || response.status === 201) {
        navigate('/login', {
          state: { message: 'Compte créé avec succès. Connectez-vous.' },
        });
      }
    } catch (err: unknown) {
      if (
        err !== null &&
        typeof err === 'object' &&
        'response' in err &&
        err.response !== null &&
        typeof err.response === 'object'
      ) {
        const axiosErr = err as { response: { status: number; data?: { message?: string } } };
        const { status, data: errData } = axiosErr.response;
        if (status === 409) {
          setError(errData?.message ?? 'Un compte avec cet email existe déjà.');
        } else if (status === 400) {
          setError(errData?.message ?? 'Données invalides. Vérifiez le formulaire.');
        } else {
          setError(errData?.message ?? 'Une erreur est survenue. Réessayez.');
        }
      } else {
        setError('Impossible de contacter le serveur. Vérifiez votre connexion.');
      }
    }
  };

  return (
    <AuthLayout>
      {/* En-tête */}
      <div className="text-center mb-6">
        <h1
          className="text-2xl font-bold text-white tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Créer un compte
        </h1>
        <p className="text-[#475569] text-sm mt-1.5">
          Rejoignez ImmoNet en moins de 2 minutes
        </p>
      </div>

      {/* Alertes */}
      {error && (
        <div className="mb-5">
          <MessageAlert type="error" title="Inscription impossible" message={error} />
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        {/* ── Identité ── */}
        <SectionDivider label="Identité" />

        <div className="grid grid-cols-2 gap-3">
          <AuthInput
            label="Nom"
            placeholder="Dupont"
            icon={User}
            error={errors.nom?.message}
            {...register('nom')}
          />
          <AuthInput
            label="Prénom"
            placeholder="Jean"
            icon={User}
            error={errors.prenom?.message}
            {...register('prenom')}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <AuthInput
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="jean@exemple.com"
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />
          <AuthInput
            label="Téléphone"
            type="tel"
            autoComplete="tel"
            placeholder="+2376XXXXXXXX"
            icon={Phone}
            error={errors.telephone?.message}
            {...register('telephone')}
          />
        </div>

        {/* ── Rôle ── */}
        <SectionDivider label="Votre profil" />

        <RoleSelector
          value={selectedRole}
          onChange={(role) => setValue('role', role, { shouldValidate: true })}
          error={errors.role?.message}
        />

        {/* ── Localisation (optionnel) ── */}
        <SectionDivider label="Localisation (optionnel)" />

        <div className="grid grid-cols-2 gap-3">
          <AuthInput
            label="Ville"
            placeholder="Douala"
            icon={MapPin}
            error={errors.ville?.message}
            {...register('ville')}
          />
          <AuthInput
            label="Pays"
            placeholder="Cameroun"
            icon={Globe}
            error={errors.pays?.message}
            {...register('pays')}
          />
        </div>

        {/* ── Sécurité ── */}
        <SectionDivider label="Sécurité" />

        <div className="grid grid-cols-2 gap-3">
          <AuthInput
            label="Mot de passe"
            type="password"
            autoComplete="new-password"
            placeholder="Min. 8 caractères"
            icon={Lock}
            error={errors.motDePasse?.message}
            {...register('motDePasse')}
          />
          <AuthInput
            label="Confirmer"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.confirmPass?.message}
            {...register('confirmPass')}
          />
        </div>

        {/* Indicateur de force du mot de passe */}
        <PasswordStrengthHint password={watch('motDePasse') ?? ''} />

        {/* ── CGU ── */}
        <div className="space-y-1 pt-1">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="mt-0.5 shrink-0">
              {acceptTerms ? (
                <CheckSquare size={17} className="text-[#22d3ee]" aria-hidden="true" />
              ) : (
                <Square
                  size={17}
                  className="text-[#475569] group-hover:text-[#94a3b8] transition-colors"
                  aria-hidden="true"
                />
              )}
            </div>
            <input type="checkbox" className="sr-only" {...register('acceptTerms')} />
            <span className="text-xs text-[#475569] leading-relaxed">
              J'accepte les{' '}
              <button type="button" className="text-[#22d3ee] hover:text-[#a5f3fc] underline underline-offset-2 transition-colors">
                Conditions d'Utilisation
              </button>{' '}
              et la{' '}
              <button type="button" className="text-[#22d3ee] hover:text-[#a5f3fc] underline underline-offset-2 transition-colors">
                Politique de Confidentialité
              </button>
              . Le rôle <strong className="text-[#94a3b8] font-semibold">PROPRIÉTAIRE</strong> nécessite un abonnement et une validation admin.
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-xs text-[#ef4444] pl-7" role="alert">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        {/* Bouton */}
        <div className="pt-1">
          <AuthButton type="submit" isLoading={isSubmitting}>
            Créer mon compte
          </AuthButton>
        </div>
      </form>

      {/* Lien connexion */}
      <p className="text-center text-xs text-[#475569] mt-5">
        Déjà membre ?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-[#22d3ee] font-medium hover:text-[#a5f3fc] transition-colors duration-150"
        >
          Se connecter
        </button>
      </p>
    </AuthLayout>
  );
};

// ─── Indicateur de force du mot de passe ─────────────────────────────────────
// Composant isolé pour garder RegisterPage lisible

interface PasswordStrengthHintProps {
  password: string;
}

const rules = [
  { label: '8 caractères min.', test: (p: string) => p.length >= 8 },
  { label: 'Une majuscule', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Un chiffre', test: (p: string) => /[0-9]/.test(p) },
] as const;

const PasswordStrengthHint: React.FC<PasswordStrengthHintProps> = ({ password }) => {
  if (!password) return null;

  return (
    <div className="flex gap-3 flex-wrap -mt-1">
      {rules.map(({ label, test }) => {
        const ok = test(password);
        return (
          <span
            key={label}
            className={`flex items-center gap-1 text-[10px] font-medium transition-colors duration-200 ${
              ok ? 'text-[#10b981]' : 'text-[#475569]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                ok ? 'bg-[#10b981]' : 'bg-[#334155]'
              }`}
            />
            {label}
          </span>
        );
      })}
    </div>
  );
};

export default RegisterPage;

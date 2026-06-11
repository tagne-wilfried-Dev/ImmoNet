import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import MessageAlert from '@/components/ui/MessageAlert';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import axios from '@/lib/axios';

// Icône Google inline pour ne pas dépendre d'une lib externe
// const GoogleIcon: React.FC = () => (
//   <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
//     <path fill="#EA4335" d="M5.27 9.77A7.1 7.1 0 0 1 12 4.9c1.69 0 3.21.6 4.4 1.57l3.28-3.28A12 12 0 0 0 12 0C7.3 0 3.25 2.7 1.26 6.65l4.01 3.12z" />
//     <path fill="#34A853" d="M16.04 18.01A7.07 7.07 0 0 1 12 19.1c-2.85 0-5.3-1.68-6.51-4.13l-4.02 3.1A11.97 11.97 0 0 0 12 24c3.24 0 6.17-1.17 8.41-3.09l-4.37-2.9z" />
//     <path fill="#FBBC05" d="M5.49 14.97A7.06 7.06 0 0 1 4.9 12c0-1.03.19-2.02.52-2.94L1.42 6.01A11.96 11.96 0 0 0 0 12c0 1.98.48 3.85 1.33 5.5l4.16-2.53z" />
//     <path fill="#4285F4" d="M12 4.9c1.7 0 3.21.6 4.4 1.57l3.28-3.28A12 12 0 0 0 12 0C7.3 0 3.25 2.7 1.26 6.65l4.01 3.12A7.1 7.1 0 0 1 12 4.9z" />
//     <path fill="#4285F4" d="M23.9 12.27c0-.79-.07-1.56-.2-2.3H12v4.51h6.69a5.72 5.72 0 0 1-2.48 3.74l4.37 2.9C22.93 19.02 24 15.84 24 12c0-.58-.04-1.15-.1-1.73z" />
//   </svg>
// );

// const FacebookIcon: React.FC = () => (
//   <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true" fill="#1877F2">
//     <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.5h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
//   </svg>
// );

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { message?: string } | null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const [error, setError] = useState('');

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    try {
      const response = await axios.post('/auth/login', data);
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        navigate('/dashboard', {
          state: {
            message: `Nous sommes ravis de vous revoir, ${response.data.nom || 'bienvenue'}.`,
          },
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
        const { status, data } = axiosErr.response;
        if (status === 401 || status === 403) {
          setError(data?.message ?? 'Email ou mot de passe incorrect.');
        } else {
          setError(data?.message ?? 'Une erreur est survenue. Réessayez.');
        }
      } else {
        setError('Impossible de contacter le serveur. Vérifiez votre connexion.');
      }
    }
  };

  return (
    <AuthLayout>
      {/* En-tête */}
      <div className="text-center mb-7">
        <h1
          className="text-2xl font-bold text-white tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Login
        </h1>
        <p className="text-[#64748b] text-sm mt-1.5">
          Connectez-vous à votre espace ImmoNet
        </p>
      </div>

      {/* Alertes */}
      {locationState?.message && (
        <div className="mb-5">
          <MessageAlert type="success" message={locationState.message} />
        </div>
      )}
      {error && (
        <div className="mb-5">
          <MessageAlert type="error" title="Connexion impossible" message={error} />
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <AuthInput
          label="Adresse email"
          type="email"
          autoComplete="username"
          placeholder="exemple@domain.com"
          icon={Mail}
          {...register('email')}
          error={errors.email?.message}
        />
        <AuthInput
          label="Mot de passe"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          icon={Lock}
          {...register('motDePasse')}
          error={errors.motDePasse?.message}
        />

        {/* Options secondaires */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs text-[#64748b] cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 rounded border-[rgba(34,211,238,0.3)] bg-transparent accent-[#22d3ee]"
            />
            Se souvenir de moi
          </label>
          <button
            type="button"
            className="text-xs text-[#22d3ee] hover:text-[#a5f3fc] transition-colors duration-150"
          >
            Mot de passe oublié ?
          </button>
        </div>

        <div className="pt-1">
          <AuthButton type="submit" isLoading={isSubmitting}>
            Se connecter
          </AuthButton>
        </div>
      </form>

      {/* Séparateur */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[rgba(34,211,238,0.08)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 text-xs text-[#475569] bg-transparent">
            ou
          </span>
        </div>
      </div>

      {/* OAuth */}
      {/* <div className="grid grid-cols-2 gap-3">
        <AuthButton variant="secondary" type="button">
          <GoogleIcon />
          Google
        </AuthButton>
        <AuthButton variant="secondary" type="button">
          <FacebookIcon />
          Facebook
        </AuthButton>
      </div> */}

      {/* Lien inscription */}
      <p className="text-center text-xs text-[#475569] mt-6">
        Pas encore de compte ?{' '}
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="text-[#22d3ee] font-medium hover:text-[#a5f3fc] transition-colors duration-150"
        >
          Créer un compte
        </button>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;

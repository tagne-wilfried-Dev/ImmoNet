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

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { message?: string } | null;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur'
  });
  const [error,setError] = useState('');


  const onSubmit = async (data: LoginFormData) => {
  setError('');
  console.log('Login payload:', data);
  
  // Optionnel : Retirer ce délai artificiel en production
  // await new Promise(res => setTimeout(res, 1500)); 

  try {
    // Si votre instance Axios inclut déjà "/api" dans sa baseURL, 
    // utilisez plutôt '/auth/login' au lieu de '/api/auth/login'
    const response = await axios.post('/auth/login', data);

    if (response.status === 200 || response.status === 201) {
      // Alignement de la clé localStorage sur 'accessToken'
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      console.log(response);
      navigate('/dashboard', { 
        state: { message: `Nous sommes ravis de vous revoir, ${response.data.nom || 'Bienvenue'}.` } 
      });
    }
  } catch (err: any) {
    // Axios bascule ici automatiquement pour les statuts HTTP 4xx et 5xx
    if (err.response) {
      const status = err.response.status;
      const serverMessage = err.response.data?.message;

      if (status === 401 || status === 403) {
        setError(serverMessage || 'Email ou mot de passe incorrect. Vérifiez vos informations.');
      } else {
        setError(serverMessage || 'Une erreur est survenue lors de la connexion au serveur.');
      }
    } else {
      setError('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
    }
  }
};

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">Connexion à ImmoNet</h1>
        <p className="text-[#94a3b8] text-sm mt-2">Accédez à votre espace personnel ImmoNet</p>
      </div>
      {locationState?.message && (
        <div className="mb-4">
          <MessageAlert type="success" message={locationState.message} />
        </div>
      )}
      {error !== '' && (
        <div className="mb-4">
          <MessageAlert type="error" title="Erreur" message={error} />
        </div>
      )}
        
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <AuthInput
          label="Adresse email"
          type="email"
          autoComplete='username'
          placeholder="exemple@domain.com"
          icon={Mail}
          {...register('email')}
          error={errors.email?.message}
        />
        <AuthInput
          label="Mot de passe"
          type="password"
          autoComplete='current-password'
          placeholder="••••••••"
          icon={Lock}
          {...register('motDePasse')}
          error={errors.motDePasse?.message}
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-[#94a3b8] cursor-pointer">
            <input type="checkbox" className="rounded border-[rgba(34,211,238,0.3)] bg-transparent text-[#22d3ee] focus:ring-0" />
            Se souvenir de moi
          </label>
          <button type="button" className="text-[#22d3ee] hover:underline">Mot de passe oublié ?</button>
        </div>

        <AuthButton type="submit" isLoading={isSubmitting}>
          Se connecter
        </AuthButton>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[rgba(34,211,238,0.1)]" /></div>
        <div className="relative flex justify-center text-xs"><span className="px-2 text-[#94a3b8] bg-[rgba(4,47,61,0.6)] rounded">Ou continuer avec</span></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AuthButton variant="secondary" type="button">Google</AuthButton>
        <AuthButton variant="secondary" type="button">Facebook</AuthButton>
      </div>

      <p className="text-center text-sm text-[#94a3b8] mt-6">
        Pas encore de compte ?{' '}
        <button onClick={() => navigate('/register')} className="text-[#22d3ee] font-medium hover:underline">
          Créer un compte
        </button>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
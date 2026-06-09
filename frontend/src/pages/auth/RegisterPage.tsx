import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Phone, Lock, CheckSquare, Square } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import MessageAlert from '@/components/ui/MessageAlert';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import axios from '@/lib/axios';

const RegisterPage: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: { acceptTerms: false as unknown as true },
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { message?: string } | null;

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    const { confirmPass, acceptTerms, ...payload } = data;
    console.log('Payload envoyé au backend :', payload);
    console.log('confirmPass et acceptTerms non envoyés:', { confirmPass, acceptTerms });
    try {
      const response = await axios.post('/api/auth/register', payload);
      if (response.status === 200 || response.status === 201) {
        navigate('/login', { state: { message: 'Compte créé avec succès.' } });
      } else {
        setError(response.statusText || 'Une erreur est survenue lors de l enregistrement.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(`Une erreur a empêché l'enregistrement : ${message}`);
    }
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const acceptTerms = watch('acceptTerms');


  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">Rejoindre ImmoNet</h1>
        <p className="text-[#94a3b8] text-sm mt-2">Créez votre compte en moins de 2 minutes</p>
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
        <div className="grid grid-cols-2 gap-4">
          <AuthInput inputName='nom' label="Nom" placeholder="Dupont" icon={User} error={errors.nom?.message} {...register('nom')} />
          <AuthInput inputName='prenom' label="Prénom" placeholder="Jean" icon={User} error={errors.prenom?.message} {...register('prenom')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <AuthInput inputName='email' label="Email" placeholder="jean@exemple.com" icon={Mail} error={errors.email?.message} type="email" {...register('email')} />
          <AuthInput inputName='telephone' label="Téléphone" placeholder="+2376XXXXXXXX" icon={Phone} error={errors.telephone?.message} type="tel" {...register('telephone')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <AuthInput inputName='motDePasse' label="Mot de passe" autoComplete='new-password' placeholder="Min. 8 caractères" icon={Lock} error={errors.motDePasse?.message} type="password" {...register('motDePasse')} />
          <AuthInput inputName='confirmPass' label="Confirmer le mot de passe" placeholder="••••••••" icon={Lock} error={errors.confirmPass?.message} type="password" {...register('confirmPass')} />
        </div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="mt-0.5">
            {acceptTerms ? <CheckSquare size={18} className="text-[#22d3ee]" /> : <Square size={18} className="text-[#94a3b8] group-hover:text-[#a5f3fc]" />}
          </div>
          <input type="checkbox" className="hidden" {...register('acceptTerms')} />
          <span className="text-xs text-[#94a3b8] leading-relaxed">
            J'accepte les <span className="text-[#22d3ee] underline cursor-pointer">Conditions Générales d'Utilisation</span> et la <span className="text-[#22d3ee] underline cursor-pointer">Politique de Confidentialité</span>. Je comprends que mon rôle initial est <strong>CLIENT</strong> et que le passage en <strong>PRO</strong> nécessite un abonnement et une validation.
          </span>
        </label>
        {errors.acceptTerms && <p className="text-xs text-[#ef4444] -mt-2">{errors.acceptTerms.message}</p>}
        <AuthButton type="submit" isLoading={isSubmitting} className="mt-2">
          Créer mon compte
        </AuthButton>
      </form>

      <p className="text-center text-sm text-[#94a3b8] mt-6">
        Déjà membre ?{' '}
        <button onClick={() => navigate('/login')} className="text-[#22d3ee] font-medium hover:underline">
          Se connecter
        </button>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
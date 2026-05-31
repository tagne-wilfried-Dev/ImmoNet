import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
// import { User, Mail, Phone, Lock, CheckSquare, Square, Loader2 } from 'lucide-react';
import { User, Mail, Phone, Lock, CheckSquare, Square } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import { registerSchema, type RegisterFormData } from '../../lib/validations/auth';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: { acceptTerms: false }
  });

  const acceptTerms = watch('acceptTerms');

  const onSubmit = async (data: RegisterFormData) => {
    // TODO: dispatch register Redux + API POST /api/auth/register
    console.log('Register payload:', data);
    await new Promise(res => setTimeout(res, 1500));
    // Redirect to email verification page or login with success toast
    navigate('/login', { state: { message: 'Compte créé. Vérifiez votre email.' } });
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">Rejoindre ImmoNet</h1>
        <p className="text-[#94a3b8] text-sm mt-2">Créez votre compte en moins de 2 minutes</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
        <div className="grid grid-cols-2 gap-4">
          <AuthInput label="Prénom" placeholder="Jean" icon={User} {...register('firstName')} error={errors.firstName?.message} />
          <AuthInput label="Nom" placeholder="Dupont" icon={User} {...register('lastName')} error={errors.lastName?.message} />
        </div>
        <AuthInput label="Email" type="email" placeholder="jean@exemple.com" icon={Mail} {...register('email')} error={errors.email?.message} />
        <AuthInput label="Téléphone" type="tel" placeholder="+2376XXXXXXXX" icon={Phone} {...register('phone')} error={errors.phone?.message} />
        <AuthInput label="Mot de passe" type="password" placeholder="Min. 8 caractères" icon={Lock} {...register('password')} error={errors.password?.message} />
        <AuthInput label="Confirmer le mot de passe" type="password" placeholder="••••••••" icon={Lock} {...register('confirmPassword')} error={errors.confirmPassword?.message} />

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
import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import RoleSelector from "@/components/auth/RoleSelector";
import SectionDivider from "@/components/auth/SectionDivider";
import AuthLayout from "@/components/layout/AuthLayout";
import MessageAlert from "@/components/ui/MessageAlert";
import { type RegisterFormData, registerSchema, type RegisterPayload } from "@/lib/validations/auth";
import { PasswordStrengthHint } from "@/lib/validations/PasswordStrengthHint";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { User, Mail, Phone, MapPin, Globe, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      defaultValues: { acceptTerms: false as any, role: undefined, ville: '', pays: '' },
   });

   const acceptTerms = watch('acceptTerms');
   console.log(acceptTerms)
   const selectedRole = watch('role');

   const onSubmit = async (data: RegisterFormData) => {
      setError('');
      const { confirmPass, acceptTerms, ville, pays, ...rest } = data;
      console.log(confirmPass, acceptTerms, ville, pays)

      const payload: RegisterPayload = {
         ...rest,
         ...(ville?.trim() ? { ville: ville.trim() } : {}),
         ...(pays?.trim() ? { pays: pays.trim() } : {}),
      };

      try {
         const response = await axios.post('/auth/register', payload);
         if (response.status === 200 || response.status === 201) {
            navigate('/login', { state: { message: 'Compte créé avec succès !' } });
         }
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
         setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.');
      }
   };
   return (
      <AuthLayout>
         {/* Header - Texte Blanc et Cyan */}
         <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
               Créer un compte
            </h1>
            <p className="text-slate-400 text-sm mt-2">
               Rejoignez <span className="text-cyan-400 font-semibold">ImmoNet</span> et propulsez vos projets
            </p>
         </div>

         {error && (
            <div className="mb-6">
               <MessageAlert type="error" title="Erreur" message={error} />
            </div>
         )}

         <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

            {/* SECTION 1: IDENTITÉ */}
            <div className="space-y-4">
               <SectionDivider label="Identité" />
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AuthInput label="Nom" placeholder="Dupont" icon={User} error={errors.nom?.message} {...register('nom')} />
                  <AuthInput label="Prénom" placeholder="Jean" icon={User} error={errors.prenom?.message} {...register('prenom')} />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AuthInput label="Email" type="email" placeholder="jean@exemple.com" icon={Mail} error={errors.email?.message} {...register('email')} />
                  <AuthInput label="Téléphone" type="tel" placeholder="+237..." icon={Phone} error={errors.telephone?.message} {...register('telephone')} />
               </div>
            </div>

            {/* SECTION 2: PROFIL */}
            <div className="space-y-4">
               <SectionDivider label="Votre profil" />
               <RoleSelector
                  value={selectedRole}
                  onChange={(role) => setValue('role', role, { shouldValidate: true })}
                  error={errors.role?.message}
               />
            </div>

            {/* SECTION 3: LOCALISATION */}
            <div className="space-y-4">
               <SectionDivider label="Localisation (Optionnel)" />
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AuthInput label="Ville" placeholder="Douala" icon={MapPin} error={errors.ville?.message} {...register('ville')} />
                  <AuthInput label="Pays" placeholder="Cameroun" icon={Globe} error={errors.pays?.message} {...register('pays')} />
               </div>
            </div>

            {/* SECTION 4: SÉCURITÉ */}
            <div className="space-y-4">
               <SectionDivider label="Sécurité" />
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AuthInput label="Mot de passe" type="password" placeholder="••••••••" icon={Lock} error={errors.motDePasse?.message} {...register('motDePasse')} />
                  <AuthInput label="Confirmer" type="password" placeholder="••••••••" icon={Lock} error={errors.confirmPass?.message} {...register('confirmPass')} />
               </div>
               <PasswordStrengthHint password={watch('motDePasse') ?? ''} />
            </div>

            {/* CGU - Version sombre */}
            <div className="pt-2">
               <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                     type="checkbox"
                     className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500 transition-all"
                     {...register('acceptTerms')}
                  />
                  <span className="text-xs text-slate-400 leading-relaxed">
                     J'accepte les{' '}
                     <button type="button" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-all">Conditions d'Utilisation</button>

                     <button type="button" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-all">
                        Politique de Confidentialité
                     </button>.
                  </span>
               </label>
               {errors.acceptTerms && (
                  <p className="text-xs text-red-400 mt-1 ml-7 font-medium" role="alert">
                     {errors.acceptTerms.message}
                  </p>
               )}
            </div>
            {/* Bouton de soumission - Effet Glow Cyan */}
            <div className="pt-4">
               <AuthButton
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full py-3 text-base font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300"
               >
                  Créer mon compte
               </AuthButton>
            </div>
         </form>

         {/* Lien vers la connexion - Style épuré sombre */}
         <p className="text-center text-sm text-slate-400 mt-8">
            Déjà membre ?{' '}
            <button
               type="button"
               onClick={() => navigate('/login')}
               className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors duration-200 underline underline-offset-4"
            >
               Se connecter
            </button>
         </p>
      </AuthLayout>
   );
};
export default RegisterPage;
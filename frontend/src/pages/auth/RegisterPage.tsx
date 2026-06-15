import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import RoleSelector from "@/components/auth/RoleSelector";
import SectionDivider from "@/components/auth/SectionDivider";
import AuthLayout from "@/components/layout/AuthLayout";
import MessageAlert from "@/components/ui/MessageAlert";
import { type RegisterFormData, registerSchema, type RegisterPayload } from "@/lib/validations/auth";
import { PasswordStrengthHint } from "@/lib/validations/PasswordStrengthHint";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/lib/axios";
import { User, Mail, Phone, Lock } from "lucide-react";
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
      defaultValues: { acceptTerms: false as any, role: undefined },
   });

   const acceptTerms = watch('acceptTerms');
   console.log(acceptTerms)
   const selectedRole = watch('role');

   const onSubmit = async (data: RegisterFormData) => {
      setError('');
      const { confirmPass, acceptTerms, ...rest } = data;
      console.log(confirmPass, acceptTerms)

      const payload: RegisterPayload = {
         ...rest,
      };

      try {
         console.log('Sending payload:', payload);
         const response = await axios.post('/auth/register', payload);
         
         if (response.status === 200 || response.status === 201) {
            navigate('/login', { 
               state: { message: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.' } 
            });
         }
      } catch (err: any) {
         setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.');
      }
   };
   return (
      <AuthLayout>
         {/* Header - Light Mode */}
         <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display">
               Créer un compte
            </h1>
            <p className="text-slate-500 text-[15px] mt-2 font-medium">
               Rejoignez <span className="text-cyan-600 font-bold">ImmoNet</span> et propulsez vos projets
            </p>
         </div>

         {error && (
            <div className="mb-8">
               <MessageAlert type="error" title="Erreur" message={error} />
            </div>
         )}

         <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

            {/* SECTION 1: IDENTITÉ */}
            <div className="space-y-5">
               <SectionDivider label="Identité" />
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <AuthInput label="Nom" placeholder="Makougang" icon={User} error={errors.nom?.message} {...register('nom')} />
                  <AuthInput label="Prénom" placeholder="pauline" icon={User} error={errors.prenom?.message} {...register('prenom')} />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <AuthInput label="Email" type="email" placeholder="pauline@exemple.com" icon={Mail} error={errors.email?.message} {...register('email')} />
                  <AuthInput label="Téléphone" type="tel" placeholder="+237..." icon={Phone} error={errors.telephone?.message} {...register('telephone')} />
               </div>
            </div>

            {/* SECTION 2: PROFIL */}
            <div className="space-y-5">
               <SectionDivider label="Votre profil" />
               <RoleSelector
                  value={selectedRole}
                  onChange={(role) => setValue('role', role, { shouldValidate: true })}
                  error={errors.role?.message}
               />
            </div>

            {/* SECTION 3: LOCALISATION */}
            {/*<div className="space-y-5">
               <SectionDivider label="Localisation (Optionnel)" />
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <AuthInput label="Ville" placeholder="Douala" icon={MapPin} error={errors.ville?.message} {...register('ville')} />
                  <AuthInput label="Pays" placeholder="Cameroun" icon={Globe} error={errors.pays?.message} {...register('pays')} />
               </div>
            </div>*/}

            {/* SECTION 4: SÉCURITÉ */}
            <div className="space-y-5">
               <SectionDivider label="Sécurité" />
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <AuthInput label="Mot de passe" type="password" placeholder="••••••••" icon={Lock} error={errors.motDePasse?.message} {...register('motDePasse')} />
                  <AuthInput label="Confirmer" type="password" placeholder="••••••••" icon={Lock} error={errors.confirmPass?.message} {...register('confirmPass')} />
               </div>
               <div className="ml-1">
                  <PasswordStrengthHint password={watch('motDePasse') ?? ''} />
               </div>
            </div>

            {/* CGU - Light Version */}
            <div className="pt-2">
               <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                     type="checkbox"
                     className="mt-1 w-4.5 h-4.5 rounded-lg border-slate-200 bg-white text-cyan-600 focus:ring-cyan-500 transition-all cursor-pointer"
                     {...register('acceptTerms')}
                  />
                  <span className="text-[13px] text-slate-500 leading-relaxed font-medium">
                     J'accepte les{' '}
                     <button type="button" className="text-cyan-600 font-bold hover:text-cyan-700 underline underline-offset-4 decoration-cyan-500/20 hover:decoration-cyan-500 transition-all">Conditions d'Utilisation</button>
                     {' '}et la{' '}
                     <button type="button" className="text-cyan-600 font-bold hover:text-cyan-700 underline underline-offset-4 decoration-cyan-500/20 hover:decoration-cyan-500 transition-all">
                        Politique de Confidentialité
                     </button>.
                  </span>
               </label>
               {errors.acceptTerms && (
                  <p className="text-[12px] text-red-600 mt-2 ml-8 font-semibold" role="alert">
                     {errors.acceptTerms.message}
                  </p>
               )}
            </div>

            {/* Bouton de soumission */}
            <div className="pt-4">
               <AuthButton
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full py-4 text-base font-bold shadow-lg shadow-cyan-600/20 hover:shadow-cyan-600/30 transition-all duration-300"
               >
                  Créer mon compte
               </AuthButton>
            </div>
         </form>

         {/* Lien vers la connexion */}
         <p className="text-center text-[15px] text-slate-500 font-medium mt-10">
            Déjà membre ?{' '}
            <button
               type="button"
               onClick={() => navigate('/login')}
               className="text-cyan-600 font-bold hover:text-cyan-700 transition-colors duration-200 underline underline-offset-4 decoration-cyan-500/30 hover:decoration-cyan-500"
            >
               Se connecter
            </button>
         </p>
      </AuthLayout>
   );
};
export default RegisterPage;
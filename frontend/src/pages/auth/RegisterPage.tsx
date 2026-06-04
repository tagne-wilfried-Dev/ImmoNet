import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, CheckSquare, Square, FileWarningIcon } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import { registerSchema, type RegisterFormData } from '../../lib/validations/auth';
import axios from 'axios';

const RegisterPage: React.FC = () => {
  
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: { acceptTerms: false }
  });

  const [ formData,setformData ] = useState({
    nom:"",
    prenom:'',
    email:"",
    telephone:"",
    motDePasse: "",
    confirmPass:""
  });

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name]:e.target.value
    });
  };
  const [ error,setError ] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) =>{
    e.preventDefault()
    if(formData.motDePasse !== formData.confirmPass){
      setError('Les mots de passe ne sont pas identiques!');
      return;
    }
    setError('')

    //api call
    try{
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      if(response.status === 200 || response.status === 201){
        navigate('/login', { state: { message: 'Compte créé. Vérifiez votre email.' } });
      }else{
        const errorText = await response.statusText;
        setError(errorText);
      }
    }catch(err){
      setError('Une erreur a empeche l\'enregistrement!'+err)
    }
  }

  // eslint-disable-next-line react-hooks/incompatible-library
  const acceptTerms = watch('acceptTerms');

  // const onSubmit = async (data: RegisterFormData) => {
  //   // TODO: dispatch register Redux + API POST /api/auth/register
  //   console.log('Register payload:', data);
  //   await new Promise(res => setTimeout(res, 1500));
  //   // Redirect to email verification page or login with success toast
  //   navigate('/login', { state: { message: 'Compte créé. Vérifiez votre email.' } });
  // };


  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">Rejoindre ImmoNet</h1>
        <p className="text-[#94a3b8] text-sm mt-2">Créez votre compte en moins de 2 minutes</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
        <div className="grid grid-cols-2 gap-4">
          <AuthInput inputName='nom' label="Nom" inputValue={formData.nom} onChange={handleChange}  placeholder="Dupont" icon={User} />
          <AuthInput inputName='prenom' label="Prénom" inputValue={formData.prenom} onChange={handleChange} placeholder="Jean" icon={User} />
        </div>
        <AuthInput inputName='email' label="Email" inputValue={formData.email} onChange={handleChange} type="email" placeholder="jean@exemple.com" icon={Mail}  />
        <AuthInput inputName='telephone' label="Téléphone" inputValue={formData.telephone} onChange={handleChange} type="tel" placeholder="+2376XXXXXXXX" icon={Phone}   />
        <AuthInput inputName='motDePasse' label="Mot de passe" inputValue={formData.motDePasse} onChange={handleChange} type="password" placeholder="Min. 8 caractères" icon={Lock}  />
        <AuthInput inputName='confirmPass' label="Confirmer le mot de passe" inputValue={formData.confirmPass} onChange={handleChange} type="password" placeholder="••••••••" icon={Lock} />

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
        {error !== '' && 
        <div className='text-amber-500 border-l-amber-900'><div><FileWarningIcon /></div>{error}</div>}
        
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
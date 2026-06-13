import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

// inputValue et inputName sont retirés : ils entrent en conflit avec value/name
// hérités de React.InputHTMLAttributes. On garde uniquement ce qui est nécessaire.
interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ElementType;
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  error,
  icon: Icon,
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase ml-1">
        {label}
      </label>

      <div className="relative group">
        {Icon && (
          <Icon
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-cyan-600 transition-colors duration-200"
            aria-hidden="true"
          />
        )}

        <input
          type={inputType}
          className={`
            w-full
            ${Icon ? 'pl-11' : 'pl-4'}
            ${isPassword ? 'pr-11' : 'pr-4'}
            py-3.5
            bg-white
            border-2
            ${error ? 'border-red-500 bg-red-50/30' : 'border-slate-100 group-hover:border-slate-200'}
            rounded-2xl
            text-slate-900 text-[15px]
            placeholder-slate-400
            focus:outline-none
            focus:border-cyan-500
            focus:bg-white
            focus:ring-4
            focus:ring-cyan-500/10
            shadow-sm
            transition-all duration-200
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-600 transition-colors duration-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-[12px] text-red-600 font-medium ml-1 mt-1" role="alert">
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;

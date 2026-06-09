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
      <label className="block text-xs font-medium text-[#a5f3fc]/80 tracking-wide uppercase">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]"
            aria-hidden="true"
          />
        )}

        <input
          type={inputType}
          className={`
            w-full
            ${Icon ? 'pl-10' : 'pl-4'}
            ${isPassword ? 'pr-10' : 'pr-4'}
            py-3
            bg-[rgba(4,47,61,0.6)]
            border
            ${error ? 'border-[#ef4444]' : 'border-[rgba(34,211,238,0.18)]'}
            rounded-xl
            text-white text-sm
            placeholder-[#64748b]
            focus:outline-none
            focus:border-[#22d3ee]
            focus:ring-[3px]
            focus:ring-[rgba(34,211,238,0.12)]
            transition-all duration-150
            autofill:bg-[rgba(4,47,61,0.6)]
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#22d3ee] transition-colors duration-150"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-[#ef4444]" role="alert">
          <AlertCircle size={11} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;

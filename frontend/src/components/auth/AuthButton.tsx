import React from 'react';
import { Loader2 } from 'lucide-react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  const base =
    'w-full flex items-center justify-center gap-2 rounded-2xl font-bold text-[15px] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<NonNullable<AuthButtonProps['variant']>, string> = {
    primary:
      'py-4 px-6 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-[0_10px_25px_-5px_rgba(8,145,178,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(8,145,178,0.4)] hover:-translate-y-0.5',
    secondary:
      'py-4 px-6 bg-white border-2 border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200 hover:text-slate-900',
    ghost:
      'py-2 px-4 bg-transparent text-slate-500 hover:text-cyan-600 hover:bg-cyan-50',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          <span>Connexion en cours…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default AuthButton;

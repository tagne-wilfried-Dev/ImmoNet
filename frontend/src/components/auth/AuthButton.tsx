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
    'w-full flex items-center justify-center gap-2 rounded-full font-medium text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<NonNullable<AuthButtonProps['variant']>, string> = {
    primary:
      'py-3 px-6 bg-gradient-to-r from-[#0891b2] to-[#22d3ee] text-white shadow-[0_4px_20px_rgba(34,211,238,0.25)] hover:shadow-[0_6px_24px_rgba(34,211,238,0.4)] hover:-translate-y-[1px]',
    secondary:
      'py-3 px-6 bg-transparent border border-[rgba(34,211,238,0.35)] text-[#22d3ee] hover:bg-[rgba(34,211,238,0.06)] hover:border-[rgba(34,211,238,0.55)]',
    ghost:
      'py-2 px-4 bg-transparent text-[#94a3b8] hover:text-[#a5f3fc] hover:bg-[rgba(255,255,255,0.04)]',
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

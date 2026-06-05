
import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({ 
  className = '', 
  variant = 'default', 
  size = 'md',
  children, 
  ...props 
}: BadgeProps) {
  const baseStyles = `
    inline-flex items-center
    rounded-full
    font-semibold
    transition-colors duration-150
  `;

  const variants = {
    default: 'bg-cyan-400/15 text-cyan-300',
    success: 'bg-emerald-500/15 text-emerald-400',
    warning: 'bg-amber-500/15 text-amber-400',
    error: 'bg-red-500/15 text-red-400',
    info: 'bg-sky-500/15 text-sky-400',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      style={{ fontFamily: 'var(--font-body)' }}
      {...props}
    >
      {children}
    </span>
  );
}
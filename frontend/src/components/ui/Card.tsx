// src/components/ui/Card.tsx
import { type HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'statistic' | 'danger';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const baseStyles = `
      relative overflow-hidden
      rounded-[20px] p-6
      backdrop-blur-[12px]
      transition-all duration-200 ease-out
    `;

    const variants = {
      default: `
        bg-gradient-to-br from-cyan-900/30 to-slate-900/60
        border border-cyan-400/10
        shadow-[0_4px_24px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.03)]
        hover:border-cyan-400/20
      `,
      statistic: `
        bg-gradient-to-br from-cyan-900/40 to-slate-900/70
        border border-cyan-400/15
        shadow-[0_4px_24px_rgba(0,0,0,0.2)]
        before:content-[""] before:absolute before:top-0 before:left-0 before:w-40 before:h-40 
        before:bg-[radial-gradient(circle,rgba(34,211,238,0.08)_0%,transparent_70%)] before:rounded-full
      `,
      danger: `
        bg-gradient-to-br from-red-950/40 to-slate-900/80
        border border-red-500/20
        shadow-[0_4px_24px_rgba(0,0,0,0.2)]
      `,
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
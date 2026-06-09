// src/components/ui/Card.tsx
import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'statistic' | 'danger';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base
          'relative overflow-hidden rounded-[20px] bg-white border border-slate-200 transition-all duration-200 ease-out',
          // Ombre douce multi-couches (DESIGN.md --shadow-sm)
          'shadow-[0_1px_3px_rgba(15,23,42,0.06),0_1px_2px_rgba(15,23,42,0.04)]',

          variant === 'default' && 'p-6',

          variant === 'interactive' && [
            'p-6 cursor-pointer',
            'hover:-translate-y-0.5 hover:border-cyan-200',
            'hover:shadow-[0_4px_6px_-1px_rgba(15,23,42,0.06),0_2px_4px_-2px_rgba(15,23,42,0.04)]',
          ],

          // Accentuation gauche cyan (DESIGN.md §5.2 Statistic)
          variant === 'statistic' && 'p-6 border-l-[3px] border-l-cyan-500',

          // Zone dangereuse
          variant === 'danger' && 'p-6 border-red-200 bg-red-50',

          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
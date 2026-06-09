// src/components/ui/Input.tsx
import { useId, type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  autocomplete?:string
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error,icon, autoComplete, helperText, className, id, disabled, readOnly, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        <div className="w-full flex gap-1.5">
        <span className="text-slate-400 shrink-0">{icon}</span>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium text-slate-700 font-body"
          >
            {label}
          </label>
        )}
        </div>
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          className={cn(
            // Base
            'w-full px-4 py-3 rounded-xl',
            'bg-white border-[1.5px] border-slate-200',
            'font-body text-[15px] text-slate-900',
            'placeholder:text-slate-400',
            'transition-all duration-200 ease-out',
            'outline-none',

            // Focus — ring cyan (DESIGN.md §5.3)
            'focus:border-cyan-500 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.12)]',

            // ReadOnly — fond légèrement teinté, curseur normal
            readOnly && 'bg-slate-50 cursor-default text-slate-600',

            // Disabled — fond muted, curseur bloqué
            disabled && 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed',

            // Error — ring rouge (DESIGN.md §5.3)
            error && 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.10)]',

            className,
          )}
          {...props}
        />

        {error && (
          <p className="text-[12px] text-red-600 font-body">{error}</p>
        )}

        {helperText && !error && (
          <p className="text-[12px] text-slate-500 font-body">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
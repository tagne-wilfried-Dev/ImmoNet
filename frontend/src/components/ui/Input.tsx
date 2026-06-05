// src/components/ui/Input.tsx
import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, disabled, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium mb-1.5 text-cyan-200/80 font-body"
          >
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-xl
            font-body text-base text-white
            placeholder:text-slate-500
            transition-all duration-200 ease-out
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-900/50 disabled:border-slate-700/50 disabled:text-slate-400
            ${error 
              ? 'border border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' 
              : 'bg-cyan-950/40 border border-cyan-400/20 focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/20'
            }
            ${className}
          `}
          {...props}
        />
        
        {error && (
          <p className="mt-1.5 text-sm text-red-400 font-body">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-slate-400 font-body">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
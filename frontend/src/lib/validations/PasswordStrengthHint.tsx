
  export interface PasswordStrengthHintProps {
  password: string;
}

import React from 'react';

const rules = [
  { label: '8 caractères min.', test: (p: string) => p.length >= 8 },
  { label: 'Une majuscule', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Un chiffre', test: (p: string) => /[0-9]/.test(p) },
] as const;
export const PasswordStrengthHint: React.FC<PasswordStrengthHintProps> = ({ password }) => {
  if (!password) return null;

  return (
    <div className="flex gap-3 flex-wrap -mt-1">
      {rules.map(({ label, test }) => {
        const ok = test(password);
        return (
          <span
            key={label}
            className={`flex items-center gap-1.5 text-[11px] font-semibold transition-colors duration-200 ${
              ok ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                ok ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]' : 'bg-slate-200'
              }`}
            />
            {label}
          </span>
        );
      })}
    </div>
  );
};
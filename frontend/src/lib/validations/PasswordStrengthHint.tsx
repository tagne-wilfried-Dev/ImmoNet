
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
            className={`flex items-center gap-1 text-[10px] font-medium transition-colors duration-200 ${
              ok ? 'text-[#10b981]' : 'text-[#475569]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                ok ? 'bg-[#10b981]' : 'bg-[#334155]'
              }`}
            />
            {label}
          </span>
        );
      })}
    </div>
  );
};
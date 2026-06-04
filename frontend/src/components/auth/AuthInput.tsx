import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  inputValue: string;
  inputName?: string;
  error?: string;
  icon?: React.ElementType;
}

const AuthInput: React.FC<AuthInputProps> = ({ label,inputValue,inputName, error, icon: Icon, type = 'text', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#a5f3fc]">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
        )}
        <input
          type={inputType}
          value={inputValue}
          name={inputName}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-10' : 'pr-4'} py-3 bg-[rgba(4,47,61,0.6)] border ${
            error ? 'border-[#ef4444]' : 'border-[rgba(34,211,238,0.2)]'
          } rounded-lg text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#22d3ee] focus:ring-[3px] focus:ring-[rgba(34,211,238,0.15)] transition-all text-sm`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#22d3ee] transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-[#ef4444]">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;
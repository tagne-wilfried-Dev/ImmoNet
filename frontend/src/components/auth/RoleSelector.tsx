import { UserCheck, Home } from "lucide-react";


interface RoleOption {
  value: 'CLIENT' | 'PROPRIETAIRE';
  label: string;
  description: string;
  Icon: React.ElementType;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: 'CLIENT',
    label: 'Client',
    description: 'Rechercher et louer / acheter un bien',
    Icon: UserCheck,
  },
  {
    value: 'PROPRIETAIRE',
    label: 'Propriétaire',
    description: 'Publier et gérer mes annonces (abonnement requis)',
    Icon: Home,
  },
];

interface RoleSelectorProps {
  value: 'CLIENT' | 'PROPRIETAIRE' | undefined;
  onChange: (role: 'CLIENT' | 'PROPRIETAIRE') => void;
  error?: string;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ value, onChange, error }) => (
  <div className="space-y-2">
    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">
      Je suis un…
    </label>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {ROLE_OPTIONS.map(({ value: roleValue, label, description, Icon }) => {
        const isSelected = value === roleValue;
        return (
          <button
            key={roleValue}
            type="button"
            onClick={() => onChange(roleValue)}
            className={`
              relative flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 text-left
              ${isSelected 
                ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.15)] ring-1 ring-cyan-400' 
                : 'border-slate-700 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800/60'
              }
            `}
          >
            <div className={`
              p-2 rounded-lg transition-all ${isSelected ? 'bg-cyan-400 text-slate-900 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-700 text-slate-400'}
            `}>
              <Icon size={18} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-semibold transition-colors ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                {label}
              </p>
              <p className={`text-xs leading-tight mt-0.5 ${isSelected ? 'text-cyan-200/70' : 'text-slate-500'}`}>
                {description}
              </p>
            </div>
            {isSelected && (
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,1)]" />
            )}
          </button>
        );
      })}
    </div>
    {error && <p className="text-xs text-red-400 font-medium" role="alert">{error}</p>}
  </div>
);
export default RoleSelector;
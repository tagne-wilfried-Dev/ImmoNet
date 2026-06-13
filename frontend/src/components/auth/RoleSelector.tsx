import { UserCheck, Home } from "lucide-react";


interface RoleOption {
  value: 'CLIENT' | 'PRO';
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
    value: 'PRO',
    label: 'Propriétaire',
    description: 'Publier et gérer mes annonces (abonnement requis)',
    Icon: Home,
  },
];

interface RoleSelectorProps {
  value: 'CLIENT' | 'PRO' | undefined;
  onChange: (role: 'CLIENT' | 'PRO') => void;
  error?: string;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ value, onChange, error }) => (
  <div className="space-y-3">
    <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase ml-1">
      Je suis...
    </label>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {ROLE_OPTIONS.map(({ value: roleValue, label, description, Icon }) => {
        const isSelected = value === roleValue;
        return (
          <button
            key={roleValue}
            type="button"
            onClick={() => onChange(roleValue)}
            className={`
              relative flex flex-col items-start gap-3 p-5 rounded-2xl border-2 transition-all duration-300 text-left
              ${isSelected 
                ? 'border-cyan-500 bg-cyan-50 shadow-sm ring-1 ring-cyan-500/20' 
                : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50'
              }
            `}
          >
            <div className={`
              p-2.5 rounded-xl transition-all ${isSelected ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20' : 'bg-slate-100 text-slate-400'}
            `}>
              <Icon size={20} />
            </div>
            <div>
              <p className={`text-[15px] font-bold transition-colors ${isSelected ? 'text-cyan-900' : 'text-slate-900'}`}>
                {label}
              </p>
              <p className={`text-[12px] leading-snug mt-1 font-medium ${isSelected ? 'text-cyan-700/80' : 'text-slate-500'}`}>
                {description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
    {error && <p className="text-[12px] text-red-600 font-medium ml-1 mt-1" role="alert">{error}</p>}
  </div>
);
export default RoleSelector;
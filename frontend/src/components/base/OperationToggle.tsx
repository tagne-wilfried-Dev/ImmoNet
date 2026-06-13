import type { OperationType } from "@/lib/types/property.types";
import { cn } from "@/lib/utils";

interface OperationToggleProps {
  value: OperationType;
  onChange: (v: OperationType) => void;
}

const OperationToggle: React.FC<OperationToggleProps> = ({ value, onChange }) => (
  <div className="inline-flex bg-slate-100 rounded-full p-1 gap-1">
    {(['VENTE', 'LOCATION'] as const).map((op) => (
      <button
        key={op}
        onClick={() => onChange(op)}
        className={cn(
          'px-5 py-2 rounded-full text-[14px] font-medium transition-all duration-200',
          value === op
            ? 'bg-white text-cyan-700 shadow-sm font-semibold'
            : 'text-slate-500 hover:text-slate-700',
        )}
      >
        {op === 'VENTE' ? 'Acheter' : 'Louer'}
      </button>
    ))}
  </div>
);
export default OperationToggle;

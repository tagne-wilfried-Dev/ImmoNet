
interface ReadOnlyFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const ReadOnlyField = ({ icon, label, value }: ReadOnlyFieldProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-slate-700 font-body">
        {label}
      </span>
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
        <span className="text-slate-400 shrink-0">{icon}</span>
        <span className="text-[15px] text-slate-600 font-body">{value}</span>
      </div>
    </div>
  );
}


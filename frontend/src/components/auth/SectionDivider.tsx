const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
  <div className="relative flex items-center gap-4 py-3">
    <div className="flex-1 border-t border-slate-700/50" />
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">
      {label}
    </span>
    <div className="flex-1 border-t border-slate-700/50" />
  </div>
);
export default SectionDivider;
const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
  <div className="relative flex items-center gap-4 py-4">
    <div className="flex-1 border-t-2 border-slate-50" />
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap bg-white px-2">
      {label}
    </span>
    <div className="flex-1 border-t-2 border-slate-50" />
  </div>
);
export default SectionDivider;
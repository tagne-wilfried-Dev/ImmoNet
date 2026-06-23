import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon: Icon, title, description, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-5 rounded-2xl border border-cyan-100 hover:border-cyan-300 hover:shadow-sm cursor-pointer transition-all group"
    >
      <div className="p-3 bg-cyan-50 w-fit rounded-xl mb-4 group-hover:bg-cyan-100 transition-colors">
        <Icon className="w-6 h-6 text-cyan-600" />
      </div>
      <h3 className="font-semibold text-base text-slate-900 mb-1.5">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default ActionCard;
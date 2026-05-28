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
      className="bg-white p-6 rounded-3xl border border-cyan-100 hover:border-cyan-300 cursor-pointer transition-all group"
    >
      <div className="p-4 bg-cyan-50 w-fit rounded-2xl mb-5 group-hover:bg-cyan-100 transition-colors">
        <Icon className="w-7 h-7 text-cyan-600" />
      </div>
      <h3 className="font-semibold text-lg text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default ActionCard;
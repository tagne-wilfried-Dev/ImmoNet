import React from 'react';
import { Home, Plus, BarChart3, Users, MessageSquare, Settings, LogOut } from 'lucide-react';

const DashboardSidebar: React.FC = () => {
  return (
    <div className="w-72 bg-white border-r border-cyan-100 h-screen fixed left-0 top-0 pt-20 hidden lg:flex flex-col">
      <div className="px-6 py-8">
        <nav className="space-y-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-cyan-50 text-cyan-600 rounded-2xl font-medium">
            <Home className="w-5 h-5" />
            Tableau de bord
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors">
            <Plus className="w-5 h-5" />
            Mes annonces
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors">
            <BarChart3 className="w-5 h-5" />
            Statistiques
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors">
            <Users className="w-5 h-5" />
            Propriétaires
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors">
            <MessageSquare className="w-5 h-5" />
            Messages
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors">
            <Settings className="w-5 h-5" />
            Paramètres
          </a>
        </nav>
      </div>

      <div className="mt-auto p-6">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition-colors">
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
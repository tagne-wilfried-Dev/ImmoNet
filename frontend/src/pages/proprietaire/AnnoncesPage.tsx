import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Building2, Edit, Eye, Trash2, Plus } from 'lucide-react';

const mockAnnonces = [
  { id: 1, title: 'Studio meublé Centre-ville', type: 'Studio', price: '45 000 CFA/mois', status: 'Publiée', views: 124 },
  { id: 2, title: 'Appartement T3 Résidence Palmier', type: 'Appartement', price: '120 000 CFA/mois', status: 'En location', views: 89 },
  { id: 3, title: 'Chambre étudiant Quartier Résidentiel', type: 'Chambre', price: '25 000 CFA/mois', status: 'Brouillon', views: 0 },
];

const statusColors: Record<string, string> = {
  'Publiée': 'bg-emerald-100 text-emerald-700',
  'En location': 'bg-cyan-100 text-cyan-700',
  'Brouillon': 'bg-slate-100 text-slate-600',
  'Archivée': 'bg-red-100 text-red-700',
};

const AnnoncesPage: React.FC = () => {
  return (
    <DashboardLayout userName="Wiliam Smith" userRole="PRO" notificationCount={3}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Mes annonces</h1>
            <p className="text-sm text-slate-600 mt-1">Gérez vos biens, photos et disponibilités</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-cyan-600 to-cyan-500 text-white text-sm font-medium rounded-full shadow-accent hover:shadow-accent-lg transition-all hover:-translate-y-0.5 active:scale-95">
            <Plus size={16} /> Nouvelle annonce
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bien</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prix</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vues</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockAnnonces.map((annonce) => (
                <tr key={annonce.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <Building2 size={20} />
                      </div>
                      <span className="font-medium text-slate-900">{annonce.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{annonce.type}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-900">{annonce.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[annonce.status]}`}>
                      {annonce.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{annonce.views}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors" title="Voir">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors" title="Modifier">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnnoncesPage;
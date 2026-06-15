import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
// import { Calendar, User, Check, X, Clock } from 'lucide-react';
import { User, Check, X, Clock } from 'lucide-react';

const mockReservations = [
  { id: 'RES-001', client: 'Marie K.', dates: '12 Mai - 18 Mai', amount: '270 000 CFA', status: 'En attente' },
  { id: 'RES-002', client: 'pauline D.', dates: '01 Juin - 15 Juin', amount: '630 000 CFA', status: 'Confirmée' },
  { id: 'RES-003', client: 'Aminata S.', dates: '20 Mai - 25 Mai', amount: '112 500 CFA', status: 'Annulée' },
];

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  'En attente': { color: 'bg-amber-100 text-amber-700', icon: Clock },
  'Confirmée': { color: 'bg-emerald-100 text-emerald-700', icon: Check },
  'Annulée': { color: 'bg-red-100 text-red-700', icon: X },
};

const ReservationsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Mes réservations</h1>
          <p className="text-sm text-slate-600 mt-1">Suivez et gérez les demandes de location</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {['En attente', 'Confirmées', 'Annulées'].map((label, i) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-600">{label}</p>
              <p className="text-2xl font-display font-bold text-slate-900 mt-1">{i === 0 ? '2' : i === 1 ? '5' : '1'}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Client</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Dates</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Montant</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockReservations.map((res) => {
                const StatusIcon = statusConfig[res.status].icon;
                return (
                  <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-600">{res.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                        <User size={16} className="text-slate-400" /> {res.client}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{res.dates}</td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-900">{res.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[res.status].color}`}>
                        <StatusIcon size={12} /> {res.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {res.status === 'En attente' && (
                        <div className="flex justify-end gap-2">
                          <button className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">Accepter</button>
                          <button className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Refuser</button>
                        </div>
                      )}
                      {res.status !== 'En attente' && <span className="text-xs text-slate-400">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReservationsPage;
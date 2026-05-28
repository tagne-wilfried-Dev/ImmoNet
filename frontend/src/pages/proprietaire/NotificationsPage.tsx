import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Bell, Check, Trash2 } from 'lucide-react';

const mockNotifications = [
  { id: 1, title: 'Nouvelle demande de réservation', desc: 'Marie K. souhaite réserver votre studio du 12 au 18 Mai.', time: 'Il y a 2h', read: false, type: 'booking' },
  { id: 2, title: 'Message reçu', desc: 'Jean D. a envoyé un message concernant votre appartement T3.', time: 'Il y a 5h', read: false, type: 'message' },
  { id: 3, title: 'Abonnement renouvelé', desc: 'Votre forfait Pro Business a été renouvelé avec succès.', time: 'Hier', read: true, type: 'system' },
];

const NotificationsPage: React.FC = () => {
  const [notifs, setNotifs] = useState(mockNotifications);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const deleteNotif = (id: number) => setNotifs(prev => prev.filter(n => n.id !== id));

  return (
    <DashboardLayout userName="Wiliam Smith" userRole="PRO" notificationCount={3}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Notifications</h1>
            <p className="text-sm text-slate-600 mt-1">Alertes, messages et mises à jour système</p>
          </div>
          <button onClick={markAllRead} className="text-sm text-cyan-700 hover:text-cyan-800 font-medium flex items-center gap-1">
            <Check size={14} /> Tout marquer comme lu
          </button>
        </div>

        <div className="space-y-3">
          {notifs.map((n) => (
            <div
              key={n.id}
              className={`bg-white border rounded-xl p-4 shadow-sm transition-all ${
                n.read ? 'border-slate-200 opacity-80' : 'border-cyan-200 shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    n.type === 'booking' ? 'bg-cyan-100 text-cyan-600' :
                    n.type === 'message' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Bell size={18} />
                  </div>
                  <div>
                    <p className={`font-medium text-slate-900 ${!n.read ? 'font-semibold' : ''}`}>{n.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{n.desc}</p>
                    <p className="text-xs text-slate-400 mt-2">{n.time}</p>
                  </div>
                </div>
                <button onClick={() => deleteNotif(n.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {notifs.length === 0 && (
            <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-200">
              <Bell size={40} className="mx-auto mb-3 opacity-40" />
              <p>Aucune notification</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
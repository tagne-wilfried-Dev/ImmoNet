import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Search, MessageSquare, Clock } from 'lucide-react';

const mockConversations = [
  { id: 1, user: 'Marie K.', lastMsg: 'Bonjour, est-ce que le bien est disponible pour...', time: '10:32', unread: true },
  { id: 2, user: 'Jean D.', lastMsg: 'Merci pour les informations, je valide ma demande.', time: 'Hier', unread: false },
  { id: 3, user: 'Support ImmoNet', lastMsg: 'Votre abonnement Pro a été renouvelé.', time: 'Lun', unread: false },
];

const MessagesPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <DashboardLayout userName="Wiliam Smith" userRole="PRO" notificationCount={3}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Messagerie</h1>
          <p className="text-sm text-slate-600 mt-1">Conversations avec clients et support</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-150">
          {/* Liste des conversations */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher une conversation..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {mockConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    selectedId === conv.id ? 'bg-cyan-50 border-l-4 border-l-cyan-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className={`text-sm font-medium ${conv.unread ? 'text-slate-900' : 'text-slate-600'}`}>{conv.user}</p>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={10} /> {conv.time}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 truncate ${conv.unread ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                    {conv.lastMsg}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Zone de chat */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
            {selectedId ? (
              <>
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-semibold">
                      {mockConversations.find(c => c.id === selectedId)?.user.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{mockConversations.find(c => c.id === selectedId)?.user}</p>
                      <p className="text-xs text-emerald-600">En ligne</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-cyan-600 text-white text-sm px-4 py-2 rounded-2xl rounded-tr-sm max-w-xs">
                      Bonjour, le studio est disponible du 15 au 30 Mai.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 text-slate-700 text-sm px-4 py-2 rounded-2xl rounded-tl-sm max-w-xs shadow-sm">
                      Parfait, je prépare ma demande de réservation. Merci !
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-slate-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Écrivez votre message..."
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button className="px-4 py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-medium hover:bg-cyan-700 transition-colors">
                      Envoyer
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Sélectionnez une conversation pour commencer</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
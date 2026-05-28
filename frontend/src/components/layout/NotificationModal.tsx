import React from 'react';
import { X, Check, Trash2 } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-start justify-end pt-20 pr-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-cyan-100 overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h3 className="font-semibold text-lg text-slate-900">Notifications</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-4 border-b bg-slate-50">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-cyan-600 bg-white border border-cyan-200 rounded-2xl hover:bg-cyan-50">
            <Check className="w-4 h-4" />
            Marquer tout comme lu
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-2xl hover:bg-slate-100">
            <Trash2 className="w-4 h-4" />
            Effacer tout
          </button>
        </div>

        {/* Liste des notifications */}
        <div className="max-h-105 overflow-auto">
          <div className="p-5 border-b hover:bg-slate-50">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                <span className="text-emerald-600 text-xl">+</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-800">Une nouvelle annonce a été créée</p>
                <p className="text-xs text-slate-500 mt-1">18/05/2026 à 02:39</p>
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            </div>
          </div>

          <div className="p-5 border-b hover:bg-slate-50">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-rose-100 rounded-2xl flex items-center justify-center shrink-0">
                ❤️
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-800">Bienvenue William Smith !</p>
                <p className="text-xs text-slate-500 mt-1">18/05/2026 à 02:27</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
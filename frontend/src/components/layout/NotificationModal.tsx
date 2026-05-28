import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Calendar, MessageSquare, ShieldCheck, Wallet } from 'lucide-react';

export type NotificationType = 'booking' | 'message' | 'system' | 'payment';

export interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: NotificationType;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
  onDelete: (id: number) => void;
}

const iconMap: Record<NotificationType, React.ElementType> = {
  booking: Calendar,
  message: MessageSquare,
  system: ShieldCheck,
  payment: Wallet,
};

// const typeColors: Record<NotificationType, string> = {
//   booking: 'bg-cyan-100 text-cyan-700',
//   message: 'bg-emerald-100 text-emerald-700',
//   system: 'bg-slate-100 text-slate-700',
//   payment: 'bg-amber-100 text-amber-700',
// };

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onDelete,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-60"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.25, ease: [0.0, 0.0, 0.2, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-60 w-full max-w-lg max-h-[85vh] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Notifications"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-display text-lg font-semibold text-slate-900">Notifications</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={onMarkAllRead}
                  className="text-xs font-medium text-cyan-700 hover:text-cyan-800 px-2 py-1 rounded-lg hover:bg-cyan-50 transition-colors"
                >
                  Tout marquer comme lu
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Fermer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <ShieldCheck size={40} className="mb-3 opacity-40" />
                  <p className="text-sm">Aucune notification</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((n) => {
                    const Icon = iconMap[n.type];
                    return (
                      <div
                        key={n.id}
                        className={`group flex items-start gap-3 p-3 rounded-xl transition-colors ${
                          n.read ? 'hover:bg-slate-50' : 'bg-cyan-50/50 hover:bg-cyan-50'
                        }`}
                      >
                        <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0peColors[n.type]}`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!n.read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                            {n.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.description}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                        </div>
                        <button
                          onClick={() => onDelete(n.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
          })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                {notifications.filter((n) => !n.read).length} non lue{notifications.filter((n) => !n.read).length > 1 ? 's' : ''}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
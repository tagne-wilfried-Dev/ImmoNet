import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { visitService } from '@/services/VisitService';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface VisitRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  propertyTitle: string;
}

const VisitRequestModal: React.FC<VisitRequestModalProps> = ({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await visitService.requestVisit({
        bienId: propertyId,
        dateSouhaitee: date,
        heureSouhaitee: time,
        messageClient: message,
      });
      setSuccess(true);
      // On laisse le message de succès 2 secondes avant de fermer
      setTimeout(() => {
        onClose();
        // Reset state after animation
        setTimeout(() => {
          setSuccess(false);
          setDate('');
          setTime('');
          setMessage('');
        }, 300);
      }, 2500);
    } catch (err: any) {
      console.error('Error requesting visit:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez vérifier vos informations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100]"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md pointer-events-auto"
            >
              <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-cyan-500/10">
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white">Planifier une visite</h2>
                    <p className="text-slate-400 text-sm mt-1 line-clamp-1">{propertyTitle}</p>
                  </div>
                  <button 
                    onClick={onClose} 
                    className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-8">
                  {success ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10 space-y-6"
                    >
                      <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white">Demande envoyée !</h3>
                        <p className="text-slate-400">Le propriétaire a été notifié et reviendra vers vous rapidement.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-cyan-500/70 ml-1 flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> Date souhaitée
                          </label>
                          <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-hidden transition-all appearance-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-cyan-500/70 ml-1 flex items-center gap-2">
                            <Clock className="w-3 h-3" /> Heure
                          </label>
                          <input
                            type="time"
                            required
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-hidden transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-cyan-500/70 ml-1 flex items-center gap-2">
                          <MessageSquare className="w-3 h-3" /> Message (optionnel)
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Bonjour, je souhaiterais visiter ce bien..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-hidden transition-all min-h-[120px] resize-none placeholder:text-slate-600"
                        />
                      </div>

                      {error && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-rose-400 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20"
                        >
                          {error}
                        </motion.p>
                      )}

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl shadow-cyan-600/20"
                      >
                        {loading ? (
                          <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Confirmer la demande
                          </>
                        )}
                      </Button>
                      
                      <p className="text-[10px] text-center text-slate-500 px-4 leading-relaxed">
                        En confirmant, vos coordonnées seront partagées avec l'annonceur pour faciliter la mise en relation.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VisitRequestModal;

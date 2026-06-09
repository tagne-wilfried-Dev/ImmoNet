import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface MessageAlertProps {
  type: 'error' | 'success';
  title?: string;
  message: string;
  /** Durée avant fermeture automatique en ms. Par défaut : 5000 */
  duration?: number;
}

const CONFIG = {
  error: {
    Icon: AlertTriangle,
    containerClass: 'border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.07)]',
    iconClass: 'text-[#ef4444]',
    titleClass: 'text-[#fca5a5]',
    textClass: 'text-[#fca5a5]/80',
    barClass: 'bg-[#ef4444]',
    closeClass: 'text-[#ef4444]/60 hover:text-[#ef4444]',
  },
  success: {
    Icon: CheckCircle2,
    containerClass: 'border-[rgba(16,185,129,0.35)] bg-[rgba(16,185,129,0.07)]',
    iconClass: 'text-[#10b981]',
    titleClass: 'text-[#6ee7b7]',
    textClass: 'text-[#6ee7b7]/80',
    barClass: 'bg-[#10b981]',
    closeClass: 'text-[#10b981]/60 hover:text-[#10b981]',
  },
} as const;

const MessageAlert: React.FC<MessageAlertProps> = ({
  type,
  title,
  message,
  duration = 5000,
}) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Barre de progression — décrémente toutes les 50ms
    const step = (50 / duration) * 100;
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev - step;
        return next <= 0 ? 0 : next;
      });
    }, 50);

    // Fermeture automatique
    const dismissTimer = setTimeout(() => {
      setVisible(false);
    }, duration);

    // Cleanup correct : annule les deux timers quand le composant démonte
    // ou quand duration/type changent
    return () => {
      clearTimeout(dismissTimer);
      clearInterval(progressInterval);
    };
  }, [duration]);

  if (!visible) return null;

  const { Icon, containerClass, iconClass, titleClass, textClass, barClass, closeClass } = CONFIG[type];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`relative rounded-xl border px-4 py-3 flex gap-3 items-start overflow-hidden ${containerClass}`}
    >
      {/* Icône */}
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconClass}`} aria-hidden="true" />

      {/* Contenu */}
      <div className="min-w-0 flex-1">
        {title && (
          <p className={`font-semibold text-sm mb-0.5 ${titleClass}`}>{title}</p>
        )}
        <p className={`text-sm leading-5 break-words ${textClass}`}>{message}</p>
      </div>

      {/* Bouton fermeture */}
      <button
        type="button"
        onClick={() => setVisible(false)}
        className={`shrink-0 mt-0.5 transition-colors ${closeClass}`}
        aria-label="Fermer la notification"
      >
        <X size={14} />
      </button>

      {/* Barre de progression en bas */}
      <div
        className={`absolute bottom-0 left-0 h-[2px] transition-all ease-linear ${barClass}`}
        style={{ width: `${progress}%`, transitionDuration: '50ms' }}
        aria-hidden="true"
      />
    </div>
  );
};

export default MessageAlert;

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
    containerClass: 'border-red-100 bg-red-50/50 backdrop-blur-sm',
    iconClass: 'text-red-600',
    titleClass: 'text-red-900',
    textClass: 'text-red-700',
    barClass: 'bg-red-500',
    closeClass: 'text-red-400 hover:text-red-600',
  },
  success: {
    Icon: CheckCircle2,
    containerClass: 'border-emerald-100 bg-emerald-50/50 backdrop-blur-sm',
    iconClass: 'text-emerald-600',
    titleClass: 'text-emerald-900',
    textClass: 'text-emerald-700',
    barClass: 'bg-emerald-500',
    closeClass: 'text-emerald-400 hover:text-emerald-600',
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
        <p className={`text-sm leading-5 wrap-break-word ${textClass}`}>{message}</p>
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
        className={`absolute bottom-0 left-0 h-0.5 transition-all ease-linear ${barClass}`}
        style={{ width: `${progress}%`, transitionDuration: '50ms' }}
        aria-hidden="true"
      />
    </div>
  );
};

export default MessageAlert;

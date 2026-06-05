import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MessageAlertProps {
  type: 'error' | 'success';
  title?: string;
  message: string;
}

const iconMap = {
  error: AlertTriangle,
  success: CheckCircle2,
};

const MessageAlert: React.FC<MessageAlertProps> = ({ type, title, message }) => {
  const Icon = iconMap[type];

  const [visible,setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    },5000);
    if(!visible)
      return clearTimeout(timer);
  },[]);

  if(!visible)
    return null;
  return (
    
    <div
      role="alert"
      className={`rounded-2xl border px-4 py-3 flex gap-3 items-start ${
        type === 'error'
          ? 'bg-amber-950/10 border-amber-700 text-red-400'
          : 'bg-emerald-950/10 border-emerald-700 text-emerald-500'
      }`}
    >
      <Icon className="mt-1 h-5 w-5 shrink-0" />
      <div className="min-w-0">
        {title && <p className="font-semibold text-sm mb-1">{title}</p>}
        <p className="flex justify-between text-sm leading-6 wrap-break-word">{message}</p>
        
      </div>
    </div>
  );
};

export default MessageAlert;


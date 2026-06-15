import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Search, MessageSquare, Clock, Send, Loader2, User } from 'lucide-react';
import { messageService } from '@/services/MessageService';
import type { ConversationResponse, MessageResponse } from '@/lib/types/message.types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { useLocation } from 'react-router-dom';

const MessagesPage: React.FC = () => {
  const location = useLocation();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  
  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [selectedConv, setSelectedConv] = useState<ConversationResponse | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Pour gérer un message initial depuis une annonce
  const [initialConvData, setInitialConvData] = useState<{ bienId: number, titre: string } | null>(
    location.state?.initialBienId ? { bienId: location.state.initialBienId, titre: location.state.initialTitre } : null
  );

  // Charger les conversations
  useEffect(() => {
    const fetchConvs = async () => {
      try {
        setLoading(true);
        const convs = await messageService.getConversations();
        setConversations(convs);

        // Si on vient d'un bien et qu'une conversation existe déjà, on la sélectionne
        if (initialConvData) {
          const existing = convs.find(c => c.bienId === initialConvData.bienId);
          if (existing) {
            setSelectedConv(existing);
            setInitialConvData(null);
          }
        }
      } catch (err) {
        console.error('Error loading conversations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConvs();
  }, []);

  // Charger les messages
  useEffect(() => {
    if (selectedConv) {
      const fetchMessages = async () => {
        try {
          setLoadingMessages(true);
          const data = await messageService.getMessages(selectedConv.id);
          setMessages(data);
          
          setConversations(prev => prev.map(c => 
            c.id === selectedConv.id ? { ...c, messagesNonLus: 0 } : c
          ));
        } catch (err) {
          console.error('Error loading messages:', err);
        } finally {
          setLoadingMessages(false);
        }
      };
      fetchMessages();
    }
  }, [selectedConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      if (selectedConv) {
        // Envoi dans une conv existante
        const sentMsg = await messageService.sendMessage({
          conversationId: selectedConv.id,
          contenu: newMessage
        });
        setMessages(prev => [...prev, sentMsg]);
        
        setConversations(prev => prev.map(c => 
          c.id === selectedConv.id 
            ? { ...c, dernierMessageContenu: sentMsg.contenu, dernierMessageAt: sentMsg.dateEnvoi } 
            : c
        ).sort((a, b) => new Date(b.dernierMessageAt).getTime() - new Date(a.dernierMessageAt).getTime()));
      } else if (initialConvData) {
        // Premier message (initialisation conversation)
        const sentMsg = await messageService.sendMessage({
          bienId: initialConvData.bienId,
          contenu: newMessage
        });
        
        // Rafraîchir les conversations pour récupérer la nouvelle
        const convs = await messageService.getConversations();
        setConversations(convs);
        const newConv = convs.find(c => c.id === sentMsg.conversationId);
        if (newConv) setSelectedConv(newConv);
        setInitialConvData(null);
      }
      
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <DashboardLayout userName={currentUser?.nom} userRole="PRO" notificationCount={0}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Messagerie</h1>
          <p className="text-sm text-slate-600 mt-1">Échangez avec vos interlocuteurs ImmoNet</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)] min-h-[500px]">
          {/* Liste des conversations */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-cyan-500" />
                </div>
              ) : conversations.length > 0 ? (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConv(conv)}
                    className={cn(
                      "w-full text-left p-5 border-b border-slate-50 hover:bg-slate-50 transition-all relative group",
                      selectedConv?.id === conv.id ? 'bg-cyan-50/50' : ''
                    )}
                  >
                    {selectedConv?.id === conv.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-r-full" />
                    )}
                    
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 border border-slate-200 group-hover:border-cyan-200 transition-colors">
                        <User size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {conv.interlocuteurPrenom} {conv.interlocuteurNom}
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                            {format(new Date(conv.dernierMessageAt || Date.now()), 'HH:mm', { locale: fr })}
                          </span>
                        </div>
                        <p className="text-[11px] text-cyan-600 font-bold uppercase tracking-wider mb-1 line-clamp-1">
                          {conv.bienTitre}
                        </p>
                        <p className={cn(
                          "text-xs truncate",
                          conv.messagesNonLus > 0 ? "text-slate-900 font-semibold" : "text-slate-500"
                        )}>
                          {conv.dernierMessageContenu || "Aucun message"}
                        </p>
                      </div>
                      {conv.messagesNonLus > 0 && (
                        <div className="absolute right-5 bottom-5 w-5 h-5 bg-cyan-500 text-white text-[10px] font-bold rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                          {conv.messagesNonLus}
                        </div>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-20 px-6">
                  <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 font-medium">Aucune conversation pour le moment</p>
                </div>
              )}
            </div>
          </div>

          {/* Zone de chat */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden">
            {selectedConv ? (
              <>
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold border border-cyan-200 shadow-sm">
                      {selectedConv.interlocuteurPrenom[0]}{selectedConv.interlocuteurNom[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {selectedConv.interlocuteurPrenom} {selectedConv.interlocuteurNom}
                      </h3>
                      <p className="text-xs text-cyan-600 font-medium">{selectedConv.bienTitre}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 bg-slate-50/30 overflow-y-auto space-y-4 custom-scrollbar">
                  {loadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="animate-spin text-cyan-500" />
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isMe = msg.expediteurEmail === currentUser?.email;
                      return (
                        <div key={msg.id || idx} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                          <div className={cn(
                            "max-w-[70%] px-5 py-3 rounded-2xl text-sm shadow-sm",
                            isMe 
                              ? "bg-cyan-600 text-white rounded-tr-sm" 
                              : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm"
                          )}>
                            <p className="leading-relaxed">{msg.contenu}</p>
                            <div className={cn(
                              "text-[10px] mt-1.5 flex items-center gap-1",
                              isMe ? "text-cyan-100" : "text-slate-400"
                            )}>
                              {format(new Date(msg.dateEnvoi), 'HH:mm', { locale: fr })}
                              {isMe && msg.lu && <span>• Lu</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-5 border-t border-slate-100 bg-white">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Votre message..."
                      className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all outline-none"
                    />
                    <button 
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="w-14 h-14 bg-cyan-600 text-white rounded-2xl flex items-center justify-center hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-600/20 active:scale-95 disabled:opacity-50 disabled:scale-100"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 bg-slate-50/30">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                    <MessageSquare size={40} className="text-slate-200" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-400">Vos messages</h3>
                    <p className="text-sm text-slate-400">Sélectionnez une discussion pour commencer</p>
                  </div>
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

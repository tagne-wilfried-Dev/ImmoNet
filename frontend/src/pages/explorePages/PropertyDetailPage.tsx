import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Maximize2, BedDouble, Bath, Stars, 
  CheckCircle2, Phone, MessageSquare, Heart, 
  Share2, ArrowLeft, Calendar, ShieldCheck,
  Info, Loader2
} from 'lucide-react';
import { propertyService } from '@/services/PropertyService';
import { reservationService } from '@/services/ReservationService';
import { type PropertyDetail, PROPERTY_TYPE_LABELS } from '@/lib/types/property.types';
import { cn, getMediaUrl } from '@/lib/utils';
import VisitRequestModal from '@/components/explore/VisitRequestModal';
import DynamicHeader from '@/components/layout/DynamicHeader';
import Footer from '@/components/layout/Footer';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

  // État pour la réservation rapide
  const [reservationDates, setReservationDates] = useState({
    start: '',
    end: ''
  });
  const [isReserving, setIsReserving] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await propertyService.getPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Impossible de charger les détails du bien.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <p className="text-slate-400 mb-6 text-xl">{error || 'Bien non trouvé'}</p>
        <Link to="/" className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-full transition-all">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const isVente = property.typeOperation === 'VENTE';

  const handleContactOwner = () => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: `/biens/${id}`,
          message: 'Veuillez vous connecter pour contacter l\'annonceur.' 
        } 
      });
      return;
    }
    
    navigate('/dashboard/messages', { 
      state: { 
        initialBienId: property.id, 
        initialTitre: property.titre 
      } 
    });
  };

  const handleRequestReservation = async () => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: `/biens/${id}`,
          message: 'Veuillez vous connecter pour effectuer une réservation.' 
        } 
      });
      return;
    }

    if (!reservationDates.start || !reservationDates.end) {
      toast.error('Veuillez choisir les dates de votre séjour.');
      return;
    }

    try {
      setIsReserving(true);
      await reservationService.createReservation({
        bienId: Number(property.id),
        dateDebut: new Date(reservationDates.start).toISOString(),
        dateFin: new Date(reservationDates.end).toISOString(),
        messageClient: "Je souhaite réserver ce bien."
      });
      
      toast.success('Demande de réservation envoyée !');
      navigate('/dashboard/reservations');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la réservation.');
    } finally {
      setIsReserving(false);
    }
  };

  // Calcul du montant estimé
  const calculateEstimatedTotal = () => {
    if (!reservationDates.start || !reservationDates.end) return 0;
    const start = new Date(reservationDates.start);
    const end = new Date(reservationDates.end);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return (diffDays || 1) * property.prix;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <DynamicHeader />
      
      {/* Barre de navigation simplifiée / Fil d'ariane */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link to={isVente ? '/explore/vente' : '/explore/louer'} className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour aux résultats
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Section Gauche : Galerie & Description */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Galerie Photos "Aqua Tech" */}
            <section className="space-y-4">
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                <img 
                  src={getMediaUrl(property.urlsPhotos[activePhoto]) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80'} 
                  alt={property.titre}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
                
                {/* Badge Statut */}
                <div className="absolute top-6 left-6 flex gap-3">
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md",
                    isVente ? "bg-cyan-600/90 text-white" : "bg-emerald-600/90 text-white"
                  )}>
                    {isVente ? 'À Vendre' : 'À Louer'}
                  </span>
                  {property.estBoost && (
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/90 text-white backdrop-blur-md">
                      Premium
                    </span>
                  )}
                </div>

                {/* Actions Rapides */}
                <div className="absolute top-6 right-6 flex gap-2">
                  <button className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors text-white">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors text-white">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              {property.urlsPhotos.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {property.urlsPhotos.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setActivePhoto(index)}
                      className={cn(
                        "relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all",
                        activePhoto === index ? "border-cyan-500 scale-105 shadow-lg shadow-cyan-500/20" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={getMediaUrl(url)} alt={`Vue ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* En-tête Infos */}
            <section className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 mb-2">
                    <span className="text-sm font-medium uppercase tracking-widest">{PROPERTY_TYPE_LABELS[property.typeBien]}</span>
                    <span className="w-1 h-1 bg-slate-600 rounded-full" />
                    <span className="text-sm text-slate-400">{property.nbVues} vues</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 leading-tight">
                    {property.titre}
                  </h1>
                  <p className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4 text-cyan-500" />
                    {property.adresse}, {property.quartier}, {property.ville}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm text-slate-400 mb-1">Prix {isVente ? 'de vente' : 'mensuel'}</p>
                  <p className="text-3xl font-mono font-bold text-cyan-400">
                    {new Intl.NumberFormat('fr-FR').format(property.prix)} <span className="text-lg">FCFA</span>
                  </p>
                </div>
              </div>

              {/* Grid Caractéristiques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Surface</p>
                    <p className="font-semibold">{property.surface} m²</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                    <BedDouble className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Chambres</p>
                    <p className="font-semibold">{property.nbChambres || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                    <Bath className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">SDB</p>
                    <p className="font-semibold">{property.nbSdb || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                    <Stars className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Étage</p>
                    <p className="font-semibold">{property.etage || 'RDC'}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Description du bien
              </h2>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>
            </section>

            {/* Équipements */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Équipements & Commodités
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {property.equipements.length > 0 ? (
                  property.equipements.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl group hover:border-cyan-500/50 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 col-span-full">Aucun équipement spécifié.</p>
                )}
              </div>
            </section>
          </div>

          {/* Section Droite : Contact & Réservation */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="sticky top-8 space-y-6">
              
              {/* Widget de Réservation Rapide (Aqua Tech) */}
              {!isVente && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-linear-to-br from-cyan-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <h4 className="font-display text-xl font-bold text-white mb-6">Réserver un séjour</h4>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Début du séjour</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
                          <input 
                            type="date" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                            value={reservationDates.start}
                            onChange={(e) => setReservationDates(prev => ({ ...prev, start: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Fin du séjour</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
                          <input 
                            type="date" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                            value={reservationDates.end}
                            onChange={(e) => setReservationDates(prev => ({ ...prev, end: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                       <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Prix par nuit</span>
                          <span className="text-white font-mono font-bold">{new Intl.NumberFormat('fr-FR').format(property.prix)} FCFA</span>
                       </div>
                       <div className="flex justify-between items-center text-lg font-bold">
                          <span className="text-white">Total estimé</span>
                          <span className="text-cyan-400 font-mono">{new Intl.NumberFormat('fr-FR').format(calculateEstimatedTotal())} FCFA</span>
                       </div>
                    </div>

                    <button 
                      onClick={handleRequestReservation}
                      disabled={isReserving}
                      className="w-full mt-6 py-4 bg-linear-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-cyan-600/20 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
                    >
                      {isReserving ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                      {isReserving ? 'Envoi en cours...' : 'Confirmer la demande'}
                    </button>
                    
                    <p className="text-[10px] text-center text-slate-500 italic">Aucun paiement ne vous sera demandé à cette étape.</p>
                  </div>
                </div>
              )}

              {/* Carte Propriétaire */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-2xl font-bold text-cyan-400 border border-cyan-500/30">
                    {property.proprietaire.prenom[0]}{property.proprietaire.nom[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-white">{property.proprietaire.prenom} {property.proprietaire.nom}</h3>
                      {property.proprietaire.estPro && (
                        < ShieldCheck className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <p className="text-sm text-slate-400">{property.proprietaire.estPro ? 'Agent Immobilier Pro' : 'Particulier'}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handleContactOwner}
                    className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-all border border-white/10 active:scale-95"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Contacter l'annonceur
                  </button>
                  <button className="w-full flex items-center justify-center gap-3 bg-white/5 text-slate-400 font-bold py-4 rounded-2xl transition-all cursor-not-allowed opacity-50">
                    <Phone className="w-5 h-5" />
                    {property.proprietaire.telephone || 'Non disponible'}
                  </button>
                </div>
              </div>

              {/* Petit Rappel Sécurité */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3">
                <Info size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-200/70 leading-relaxed">
                  Ne versez jamais d'argent avant d'avoir visité le bien. ImmoNet protège vos transactions via notre système de réservation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetailPage;

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Home, 
  Maximize, 
  BedDouble, 
  CheckCircle2, 
  ArrowLeft, 
  Calendar,
  Phone,
  MessageCircle,
  Loader2,
  Share2,
  Heart
} from 'lucide-react';
import { bienService } from '@/services/BienService';
import { type BienDetailResponse, TypeOperation } from '@/types/bien.types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const BienDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bien, setBien] = useState<BienDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const fetchBien = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await bienService.getDetail(parseInt(id));
      setBien(data);
    } catch (error) {
      console.error('Erreur lors de la récupération du bien:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBien();
  }, [fetchBien]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header currentExplore="rent" onNavigate={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-500 mb-4" />
          <p className="text-slate-600 font-medium">Chargement de l'annonce...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!bien) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header currentExplore="rent" onNavigate={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Home className="w-10 h-10 text-slate-300" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Annonce introuvable</h1>
          <p className="text-slate-600 mb-8 max-w-md">
            Désolé, l'annonce que vous recherchez n'existe pas ou a été retirée.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-cyan-600 text-white font-medium rounded-2xl hover:bg-cyan-700 transition-all"
          >
            Retour à l'accueil
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const isLocation = bien.typeOperation === TypeOperation.LOCATION;
  const images = bien.urlsPhotos && bien.urlsPhotos.length > 0 
    ? bien.urlsPhotos 
    : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop'];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header currentExplore={isLocation ? 'rent' : 'sell'} onNavigate={() => {}} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation / Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-cyan-600 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Retour aux résultats
          </button>
          
          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-cyan-600 hover:border-cyan-200 transition-all">
              <Share2 size={20} />
            </button>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-red-500 hover:border-red-200 transition-all">
              <Heart size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Colonne Gauche : Images & Description */}
          <div className="lg:col-span-8 space-y-10">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="aspect-video rounded-3xl overflow-hidden bg-slate-200 shadow-sm border border-slate-100">
                <img 
                  src={images[activeImage]} 
                  alt={bien.ville} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative flex-shrink-0 w-24 aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === index ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Infos Principales */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isLocation ? 'bg-cyan-100 text-cyan-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {isLocation ? 'À Louer' : 'À Vendre'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                      {bien.typeBien.replace('_', ' ')}
                    </span>
                  </div>
                  <h1 className="text-3xl font-display font-bold text-slate-900 mb-3">
                    {bien.typeBien.replace('_', ' ')} à {bien.ville}
                  </h1>
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={18} className="text-cyan-500" />
                    <span className="text-lg">{bien.quartier}, {bien.ville}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-slate-500 uppercase font-bold tracking-widest mb-1">Prix</div>
                  <div className="text-3xl font-display font-bold text-cyan-600">
                    {new Intl.NumberFormat('fr-FR').format(bien.prix)} FCFA
                    {isLocation && <span className="text-lg font-normal text-slate-400"> /mois</span>}
                  </div>
                </div>
              </div>

              {/* Caractéristiques rapides */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                    <Maximize size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{bien.surface} m²</div>
                    <div className="text-xs text-slate-500">Surface</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                    <BedDouble size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{bien.nbChambres}</div>
                    <div className="text-xs text-slate-500">Chambres</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{bien.estMeuble ? 'Oui' : 'Non'}</div>
                    <div className="text-xs text-slate-500">Meublé</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {new Date(bien.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                    </div>
                    <div className="text-xs text-slate-500">Publié le</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Description du bien</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {bien.description || "Aucune description détaillée n'a été fournie pour ce bien."}
                </p>
              </div>
            </div>
          </div>

          {/* Colonne Droite : Contact & Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Contact Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm sticky top-28">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Contacter l'annonceur</h3>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-display font-bold text-xl overflow-hidden">
                  {bien.proprietaire.nom.charAt(0)}{bien.proprietaire.prenom.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{bien.proprietaire.prenom} {bien.proprietaire.nom}</div>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <CheckCircle2 size={12} />
                    {bien.proprietaire.estPro ? 'Professionnel vérifié' : 'Propriétaire particulier'}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full flex items-center justify-center gap-3 py-4 bg-linear-to-r from-cyan-600 to-cyan-500 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all hover:-translate-y-0.5 active:scale-95">
                  <MessageCircle size={20} />
                  Envoyer un message
                </button>
                <button className="w-full flex items-center justify-center gap-3 py-4 border-2 border-cyan-600 text-cyan-600 font-bold rounded-2xl hover:bg-cyan-50 transition-all">
                  <Phone size={20} />
                  {bien.proprietaire.telephone || 'Voir le numéro'}
                </button>
              </div>

              <div className="mt-8 p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Dites que vous avez trouvé cette annonce sur <span className="text-cyan-600 font-bold">ImmoNet</span> pour faciliter la mise en relation.
                </p>
              </div>
            </div>

            {/* Aide / Sécurité */}
            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
              <h4 className="font-bold text-amber-900 text-sm mb-2">Conseil de sécurité</h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Ne versez jamais d'argent avant d'avoir visité le bien et signé un contrat. En cas de doute, signalez l'annonce.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BienDetailPage;
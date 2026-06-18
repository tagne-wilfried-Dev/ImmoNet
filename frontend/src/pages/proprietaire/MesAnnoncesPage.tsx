import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  // Building2, Eye, Trash2,
   Plus,
  // Search, Filter,
   X, Loader2,
  Megaphone, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '@/services/PropertyService';
import { type PropertySummary, PROPERTY_TYPE_LABELS } from '@/lib/types/property.types';
import { toast } from 'sonner';
import { getMediaUrl } from '@/lib/utils';

// const statusLabels: Record<string, string> = {
//   'PUBLIE': 'En ligne',
//   'EN_LOCATION': 'Loué / Occupé',
//   'BROUILLON': 'Brouillon',
//   'SUSPENDU': 'Suspendu',
// };

// const statusColors: Record<string, string> = {
//   'PUBLIE': 'bg-emerald-500 text-white',
//   'EN_LOCATION': 'bg-cyan-500 text-white',
//   'BROUILLON': 'bg-slate-200 text-slate-600',
//   'SUSPENDU': 'bg-amber-500 text-white',
// };

const MesAnnoncesPage: React.FC = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableBiens, setAvailableBiens] = useState<PropertySummary[]>([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getMyListings(0, 100);
      setListings(response.data);
    } catch (err) {
      console.error('Erreur chargement annonces:', err);
      toast.error('Impossible de charger vos annonces.');
    } finally {
      setLoading(false);
    }
  };

  const openPublicationModal = async () => {
    setIsModalOpen(true);
    try {
      setLoadingAvailable(true);
      const data = await propertyService.getAvailableProperties();
      setAvailableBiens(data);
    } catch (err) {
      toast.error('Erreur lors du chargement de vos biens publiables.');
    } finally {
      setLoadingAvailable(false);
    }
  };

  const handlePublierExistant = async (id: number) => {
    try {
      await propertyService.updatePropertyStatus(id, 'PUBLIE');
      toast.success('Le bien a été mis en ligne avec succès !');
      setIsModalOpen(false);
      fetchListings();
    } catch (err) {
      toast.error('Erreur lors de la mise en ligne.');
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Megaphone className="text-cyan-600" />
              Mes annonces en ligne
            </h1>
            <p className="text-sm text-slate-600 mt-1">Gérez votre visibilité sur le marché ImmoNet</p>
          </div>
          <button
            onClick={openPublicationModal}
            className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-cyan-600 to-cyan-500 text-white text-sm font-bold rounded-full shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 transition-all active:scale-95">
            <Plus size={18} /> Nouvelle annonce
          </button>
        </div>

        {/* Stats Rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Annonces actives</p>
            <p className="text-3xl font-display font-bold text-slate-900 mt-1">{listings.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Vues totales</p>
            <p className="text-3xl font-display font-bold text-cyan-600 mt-1">
              {listings.reduce((acc, curr) => acc + (curr.nbVues || 0), 0)}
            </p>
          </div>
        </div>

        {/* Liste des annonces */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center">
              <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-500">Chargement de vos annonces...</p>
            </div>
          ) : listings.length > 0 ? (
            listings.map((annonce) => (
              <div key={annonce.id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-cyan-200 hover:shadow-xl transition-all duration-300">
                <div className="relative h-48">
                  <img
                    src={annonce.urlPhotoPrincipale || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'}
                    alt={annonce.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase rounded-full shadow-lg">
                      En Ligne
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 truncate">{annonce.titre}</h3>
                    <p className="text-sm text-slate-500">{annonce.ville}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <p className="font-mono font-bold text-cyan-700">
                      {new Intl.NumberFormat('fr-FR').format(annonce.prix)} CFA
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/biens/${annonce.id}`)}
                        className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-cyan-50 hover:text-cyan-600 transition-colors" title="Voir sur le site">
                        <ExternalLink size={16} />
                      </button>
                      <button
                        onClick={() => propertyService.updatePropertyStatus(annonce.id, 'SUSPENDU').then(fetchListings)}
                        className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-amber-50 hover:text-amber-600 transition-colors" title="Suspendre">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white border-2 border-dashed border-slate-200 rounded-3xl">
              <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Aucune annonce en ligne</h3>
              <p className="text-slate-500 max-w-md mx-auto">Vos biens immobiliers ne sont pas visibles par les clients. Mettez-les en ligne pour recevoir des demandes.</p>
            </div>
          )}
        </div>

        {/* Modal de Publication "Aqua Tech" */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-display font-bold text-slate-900">Mettre un bien en ligne</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/publier')}
                    className="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-slate-200 rounded-3xl hover:border-cyan-500 hover:bg-cyan-50/30 transition-all group">
                    <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus size={32} />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-900">Nouveau Bien</p>
                      <p className="text-xs text-slate-500 mt-1">Créer de A à Z</p>
                    </div>
                  </button>

                  <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Choisir un existant</p>
                    {loadingAvailable ? (
                      <Loader2 className="w-6 h-6 animate-spin text-cyan-500 mx-auto" />
                    ) : availableBiens.length > 0 ? (
                      availableBiens.map(bien => (
                        <button
                          key={bien.id}
                          onClick={() => handlePublierExistant(bien.id)}
                          className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-transparent hover:border-cyan-400 hover:bg-white transition-all text-left group">
                          <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 overflow-hidden shrink-0">
                            {bien.urlPhotoPrincipale && <img src={getMediaUrl(bien.urlPhotoPrincipale)} className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{bien.titre}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{PROPERTY_TYPE_LABELS[bien.typeBien]} • {bien.ville}</p>
                          </div>
                          <Megaphone size={14} className="text-slate-300 group-hover:text-cyan-500" />
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 italic">Aucun bien disponible au patrimoine.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MesAnnoncesPage;

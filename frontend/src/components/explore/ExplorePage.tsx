import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { MapPin, Search, X, Loader2 } from 'lucide-react';
import { propertyService } from '@/services/PropertyService';
import type { PropertySummary, SearchFilters } from '@/lib/types/property.types';
import PropertyCard from '@/components/ui/PropertyCard';

interface ExplorePageProps {
  title: string;
  mode: 'vendre' | 'louer';
}

const ExplorePage: React.FC<ExplorePageProps> = ({ title, mode }) => {
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  
  const [filters, setFilters] = useState<SearchFilters>({
    typeOperation: mode === 'vendre' ? 'VENTE' : 'LOCATION',
  });

  const [currentExplore, setCurrentExplore] = useState<'rent' | 'sell'>(mode === 'vendre' ? 'sell' : 'rent');

  const handleHeaderNavigate = (type: 'rent' | 'sell') => {
    setCurrentExplore(type);
    setFilters(prev => ({ ...prev, typeOperation: type === 'sell' ? 'VENTE' : 'LOCATION' }));
    setPage(0);
  };

  const location = useLocation();

  // Sync filters from query params (e.g., ?typeOperation=VENTE)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeOp = params.get('typeOperation');
    if (typeOp === 'VENTE') {
      setFilters(prev => ({ ...prev, typeOperation: 'VENTE' }));
      setCurrentExplore('sell');
      setPage(0);
    } else if (typeOp === 'LOCATION') {
      setFilters(prev => ({ ...prev, typeOperation: 'LOCATION' }));
      setCurrentExplore('rent');
      setPage(0);
    }
  }, [location.search]);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const response = await propertyService.getProperties(filters, page, 16);
      setProperties(response.data);
      setTotalElements(response.total);
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleFilterChange = (name: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(0); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setFilters({ typeOperation: mode === 'vendre' ? 'VENTE' : 'LOCATION' });
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header currentExplore={currentExplore} onNavigate={handleHeaderNavigate} />
      {/* En-tête de page */}
      <div className="bg-white border-b border-cyan-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 mb-2">
            {title}
          </h1>
          <p className="text-slate-600 text-lg">
            Découvrez les meilleures offres {mode === 'vendre' ? 'à vendre' : 'à louer'} sur ImmoNet
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Colonne Filtres */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-cyan-100 sticky top-8">
              <h2 className="font-semibold text-xl text-slate-900 mb-6">Filtrer votre recherche</h2>

              {/* Pays */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Pays</label>
                <select 
                  value={filters.pays || ''}
                  onChange={(e) => handleFilterChange('pays', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-cyan-100 rounded-2xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                >
                  <option value="">Tous les pays</option>
                  <option value="Bénin">Bénin</option>
                  <option value="Cameroun">Cameroun</option>
                  <option value="Sénégal">Sénégal</option>
                </select>
              </div>

              {/* Type de bien */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Type de bien</label>
                <select 
                  value={filters.typeBien || ''}
                  onChange={(e) => handleFilterChange('typeBien', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-cyan-100 rounded-2xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                >
                  <option value="">Tous les types</option>
                  <option value="APPARTEMENT">Appartement</option>
                  <option value="MAISON">Maison</option>
                  <option value="VILLA">Villa</option>
                  <option value="TERRAIN">Terrain</option>
                </select>
              </div>

              {/* Ville */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ville</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ex: Cotonou, Douala..."
                    value={filters.ville || ''}
                    onChange={(e) => handleFilterChange('ville', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-cyan-100 rounded-2xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                  />
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-500 w-4 h-4" />
                </div>
              </div>

              {/* Prix Min/Max */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Prix Min</label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.prixMin || ''}
                    onChange={(e) => handleFilterChange('prixMin', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-cyan-100 rounded-2xl focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Prix Max</label>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.prixMax || ''}
                    onChange={(e) => handleFilterChange('prixMax', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-cyan-100 rounded-2xl focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={fetchProperties}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Rechercher
                </button>
                <button 
                  onClick={clearFilters}
                  className="p-3.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Colonne Résultats */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Infos Résultats */}
            <div className="flex justify-between items-center">
              <p className="text-slate-600">
                <span className="font-bold text-slate-900">{totalElements}</span> biens trouvés
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Trier par :</span>
                <select className="bg-transparent font-medium text-slate-900 outline-none cursor-pointer">
                  <option>Plus récents</option>
                  <option>Prix croissant</option>
                  <option>Prix décroissant</option>
                </select>
              </div>
            </div>

            {/* Grille de Résultats */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
                <p className="text-slate-500">Chargement des annonces...</p>
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun résultat trouvé</h3>
                <p className="text-slate-500">Essayez de modifier vos critères de recherche pour trouver plus de biens.</p>
                <button 
                  onClick={clearFilters}
                  className="mt-6 text-cyan-600 font-bold hover:underline"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            )}

            {/* Pagination simple */}
            {totalElements > 16 && (
              <div className="flex justify-center gap-2 pt-8">
                <button 
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                  className="px-6 py-2 border border-slate-200 rounded-xl disabled:opacity-30"
                >
                  Précédent
                </button>
                <button 
                  disabled={(page + 1) * 16 >= totalElements}
                  onClick={() => setPage(p => p + 1)}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl disabled:opacity-30"
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
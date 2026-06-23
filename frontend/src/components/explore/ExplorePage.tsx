import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import DynamicHeader from '@/components/layout/DynamicHeader';
import { MapPin, Search, X, Loader2, LayoutGrid, MapIcon } from 'lucide-react';
import { propertyService } from '@/services/PropertyService';
import { favoriService } from '@/services/FavoriService';
import type { PropertySummary, SearchFilters } from '@/lib/types/property.types';
import PropertyCard from '@/components/ui/PropertyCard';
import { cn } from '@/lib/utils';
import PropertyMap from './PropertyMap';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';

interface ExplorePageProps {
  title: string;
}

const ExplorePage: React.FC<ExplorePageProps> = ({ title }) => {
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const location = useLocation();

  // Déterminer le mode en fonction du pathname
  const isSellingMode = location.pathname.includes('/vente');
  const [filters, setFilters] = useState<SearchFilters>({
    typeOperation: isSellingMode ? 'VENTE' : 'LOCATION',
  });

  const [currentExplore, setCurrentExplore] = useState<'rent' | 'sell'>(isSellingMode ? 'sell' : 'rent');

  const handleHeaderNavigate = (type: 'rent' | 'sell') => {
    setCurrentExplore(type);
    setFilters(prev => ({ ...prev, typeOperation: type === 'sell' ? 'VENTE' : 'LOCATION' }));
    setPage(0);
  };

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

  // ── Favoris (utilisateur connecté uniquement) ───────────────────────────────
  const { user } = useAppSelector((state) => state.auth);
  const [favorisIds, setFavorisIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!user) {
      setFavorisIds(new Set());
      return;
    }
    favoriService
      .getFavorisIds()
      .then((ids) => setFavorisIds(new Set(ids)))
      .catch((err) => console.error('Erreur chargement favoris:', err));
  }, [user]);

  const handleFavorisToggle = async (id: number | string) => {
    const bienId = Number(id);
    const isFav = favorisIds.has(bienId);
    // Mise à jour optimiste
    setFavorisIds((prev) => {
      const next = new Set(prev);
      if (isFav) next.delete(bienId);
      else next.add(bienId);
      return next;
    });
    try {
      if (isFav) {
        await favoriService.removeFavori(bienId);
      } else {
        await favoriService.addFavori(bienId);
        toast.success('Ajouté à vos favoris');
      }
    } catch (err) {
      // Rollback en cas d'échec
      console.error('Erreur favoris:', err);
      setFavorisIds((prev) => {
        const next = new Set(prev);
        if (isFav) next.add(bienId);
        else next.delete(bienId);
        return next;
      });
      toast.error('Action impossible, réessayez.');
    }
  };

  const handleFilterChange = (name: keyof SearchFilters, value: any) => {
    setFilters(prev => {
      const next = { ...prev };
      if (value === '' || value === undefined || value === null) {
        delete next[name];
      } else {
        next[name] = value;
      }
      return next;
    });
    setPage(0); // Reset to first page on filter change
  };

  // Convertit une saisie texte en nombre (ou undefined si vide)
  const handleNumberChange = (name: keyof SearchFilters, raw: string) => {
    handleFilterChange(name, raw === '' ? undefined : Number(raw));
  };

  const clearFilters = () => {
    setFilters({ typeOperation: isSellingMode ? 'VENTE' : 'LOCATION' });
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DynamicHeader currentExplore={currentExplore} onNavigate={handleHeaderNavigate} />
      {/* En-tête de page */}
      <div className="bg-white border-b border-cyan-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-1">
            {title}
          </h1>
          <p className="text-slate-600 text-[15px]">
            Découvrez les meilleures offres {isSellingMode ? 'à vendre' : 'à louer'} sur ImmoNet
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Colonne Filtres */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-cyan-100 sticky top-6">
              <h2 className="font-semibold text-lg text-slate-900 mb-5">Filtrer votre recherche</h2>

              {/* Type de bien */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Type de bien</label>
                <select
                  value={filters.typeBien || ''}
                  onChange={(e) => handleFilterChange('typeBien', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-cyan-100 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                >
                  <option value="">Tous les types</option>
                  <option value="APPARTEMENT">Appartement</option>
                  <option value="APPARTEMENT_MEUBLEE">Appartement meublé</option>
                  <option value="MAISON">Maison</option>
                  <option value="VILLA">Villa</option>
                  <option value="STUDIO">Studio</option>
                  <option value="TERRAIN">Terrain</option>
                  <option value="BUREAU">Bureau</option>
                  <option value="LOCAL_COMMERCIAL">Local commercial</option>
                </select>
              </div>

              {/* Ville */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ville</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ex: Yaoundé, Douala..."
                    value={filters.ville || ''}
                    onChange={(e) => handleFilterChange('ville', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-cyan-100 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                  />
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-500 w-4 h-4" />
                </div>
              </div>

              {/* Quartier */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Quartier</label>
                <input
                  type="text"
                  placeholder="Ex: Bastos, Bonapriso..."
                  value={filters.quartier || ''}
                  onChange={(e) => handleFilterChange('quartier', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-cyan-100 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                />
              </div>

              {/* Prix Min/Max */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Prix Min</label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.prixMin ?? ''}
                    onChange={(e) => handleNumberChange('prixMin', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-cyan-100 rounded-xl focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Prix Max</label>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.prixMax ?? ''}
                    onChange={(e) => handleNumberChange('prixMax', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-cyan-100 rounded-xl focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              {/* Surface Min/Max */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Surface min (m²)</label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.surfaceMin ?? ''}
                    onChange={(e) => handleNumberChange('surfaceMin', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-cyan-100 rounded-xl focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Surface max (m²)</label>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.surfaceMax ?? ''}
                    onChange={(e) => handleNumberChange('surfaceMax', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-cyan-100 rounded-xl focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              {/* Nombre de chambres minimum */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Chambres (minimum)</label>
                <select
                  value={filters.nbChambres ?? ''}
                  onChange={(e) => handleNumberChange('nbChambres', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-cyan-100 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                >
                  <option value="">Indifférent</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Meublé */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ameublement</label>
                <select
                  value={filters.estMeuble === undefined ? '' : String(filters.estMeuble)}
                  onChange={(e) =>
                    handleFilterChange('estMeuble', e.target.value === '' ? undefined : e.target.value === 'true')
                  }
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-cyan-100 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                >
                  <option value="">Peu importe</option>
                  <option value="true">Meublé</option>
                  <option value="false">Non meublé</option>
                </select>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={fetchProperties}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-sm shadow-cyan-600/20 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Rechercher
                </button>
                <button
                  onClick={clearFilters}
                  className="p-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all"
                >
                  <X className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Colonne Résultats */}
          <div className="lg:col-span-8 space-y-6">

            {/* Infos Résultats & Toggle Vue */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-600">
                <span className="font-bold text-slate-900 tabular-nums">{totalElements}</span> biens trouvés
              </p>

              <div className="flex items-center gap-4">
                {/* Toggle Vue Grid/Map */}
                <div className="flex bg-white p-1 rounded-xl border border-cyan-100 shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      viewMode === 'grid' ? "bg-cyan-500 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      viewMode === 'map' ? "bg-cyan-500 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <MapIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grille ou Carte */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
                <p className="text-slate-500">Chargement des annonces...</p>
              </div>
            ) : viewMode === 'map' ? (
              <div className="h-[600px] w-full">
                <PropertyMap properties={properties} />
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onFavorisToggle={user ? handleFavorisToggle : undefined}
                    isFavoris={favorisIds.has(Number(property.id))}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-200">
                <Search className="w-11 h-11 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-1.5">Aucun résultat trouvé</h3>
                <p className="text-sm text-slate-500">Essayez de modifier vos critères de recherche pour trouver plus de biens.</p>
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
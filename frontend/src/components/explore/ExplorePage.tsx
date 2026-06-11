import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Search, Filter, X, Menu, Loader2 } from 'lucide-react';
import { bienService } from '@/services/BienService';
import { 
  type BienSummaryResponse, 
  type BienFilterRequest, 
  TypeOperation, 
  TypeBien 
} from '@/types/bien.types';
import { BienCard } from './BienCard';

interface ExplorePageProps {
  title: string;
  mode: 'vendre' | 'louer';
}

const ExplorePage: React.FC<ExplorePageProps> = ({ title, mode }) => {
  const [biens, setBiens] = useState<BienSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  const [filters, setFilters] = useState<BienFilterRequest>({
    typeOperation: mode === 'vendre' ? TypeOperation.VENTE : TypeOperation.LOCATION,
    ville: '',
    typeBien: undefined,
    prixMax: undefined,
  });

  const fetchBiens = useCallback(async (page: number, currentFilters: BienFilterRequest) => {
    try {
      setLoading(true);
      const response = await bienService.rechercher(currentFilters, page, pageSize);
      setBiens(response.content);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Erreur lors de la récupération des biens:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBiens(0, filters);
  }, [fetchBiens, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? undefined : value
    }));
    setCurrentPage(0);
  };

  const resetFilters = () => {
    setFilters({
      typeOperation: mode === 'vendre' ? TypeOperation.VENTE : TypeOperation.LOCATION,
      ville: '',
      typeBien: undefined,
      prixMax: undefined,
    });
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* En-tête de page */}
      <div className="bg-white border-b border-cyan-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 mb-2">
            {title}
          </h1>
          <p className="text-slate-600 text-lg">
            Découvrez les meilleures offres {mode === 'vendre' ? 'à vendre' : 'à louer'} en Afrique centrale
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Colonne Filtres */}
          <div className="lg:col-span-6 xl:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-cyan-100 sticky top-8">
              <h2 className="font-semibold text-xl text-slate-900 mb-8">Filtrer votre recherche</h2>

              {/* Type de bien */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Type de bien recherché
                </label>
                <select 
                  name="typeBien"
                  value={filters.typeBien || ''}
                  onChange={handleFilterChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-cyan-100 rounded-2xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-slate-700"
                >
                  <option value="">Tous les types</option>
                  {Object.values(TypeBien).map(type => (
                    <option key={type} value={type}>{type.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              {/* Ville */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ville
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="ville"
                    value={filters.ville || ''}
                    onChange={handleFilterChange}
                    placeholder="Ex: Douala, Yaoundé..."
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-cyan-100 rounded-2xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-slate-700"
                  />
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 w-5 h-5" />
                </div>
              </div>

              {/* Prix Max */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Prix maximum (FCFA)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="prixMax"
                    value={filters.prixMax || ''}
                    onChange={handleFilterChange}
                    placeholder="Ex: 500000"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-cyan-100 rounded-2xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-slate-700"
                  />
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => fetchBiens(0, filters)}
                  className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-white font-medium py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-cyan-500/30"
                >
                  <Search className="w-5 h-5" />
                  Rechercher
                </button>

                <button 
                  onClick={resetFilters}
                  className="w-full flex gap-2 justify-center items-center py-4 border border-cyan-200 hover:bg-cyan-50 text-slate-700 font-medium rounded-2xl transition-all"
                >
                  <X className="w-5 h-5" />
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          {/* Colonne Résultats */}
          <div className="lg:col-span-6 xl:col-span-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin text-cyan-500 mb-4" />
                <p>Chargement des biens...</p>
              </div>
            ) : biens.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {biens.map(bien => (
                  <BienCard key={bien.id} bien={bien} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-slate-300 w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun bien trouvé</h3>
                <p className="text-slate-500">
                  Essayez de modifier vos filtres pour trouver ce que vous cherchez.
                </p>
              </div>
            )}

            {/* Pagination simple */}
            {!loading && totalElements > pageSize && (
              <div className="mt-10 flex justify-center gap-2">
                {Array.from({ length: Math.ceil(totalElements / pageSize) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentPage(i);
                      fetchBiens(i, filters);
                    }}
                    className={`w-10 h-10 rounded-xl font-medium transition-all ${
                      currentPage === i
                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-cyan-200 hover:bg-cyan-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info barre */}
        {!loading && (
          <div className="mt-10 flex flex-col sm:flex-row justify-between items-center text-sm border-t border-slate-200 pt-8">
            <p className="text-slate-600">
              <span className="font-medium text-slate-900">{totalElements}</span> biens correspondent à votre recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
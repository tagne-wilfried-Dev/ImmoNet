import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Building2, Edit, Eye, Trash2, Plus, 
  CheckCircle2, RotateCcw, Loader2, 
  Search, Filter, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '@/services/PropertyService';
import { type PropertySummary, PROPERTY_TYPE_LABELS } from '@/lib/types/property.types';
import { toast } from 'sonner';
import { useAppSelector } from '@/store/hooks';

const statusLabels: Record<string, string> = {
  'PUBLIE': 'Mis en ligne',
  'EN_LOCATION': 'Loué / Occupé',
  'BROUILLON': 'Brouillon',
  'ARCHIVE': 'Archivé',
  'VENDU': 'Vendu',
  'SUSPENDU': 'Suspendu',
};

const statusColors: Record<string, string> = {
  'PUBLIE': 'bg-emerald-500 text-white',
  'EN_LOCATION': 'bg-cyan-500 text-white',
  'BROUILLON': 'bg-slate-200 text-slate-600',
  'ARCHIVE': 'bg-red-500 text-white',
  'VENDU': 'bg-slate-900 text-white',
  'SUSPENDU': 'bg-amber-500 text-white',
};

const MesBiensPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getMyProperties();
      setProperties(response.data);
      setFilteredProperties(response.data);
    } catch (err) {
      console.error('Erreur chargement biens:', err);
      toast.error('Impossible de charger votre patrimoine.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  // Logique de filtrage locale pour fluidité
  useEffect(() => {
    let result = properties;
    
    if (searchQuery) {
      result = result.filter(p => 
        p.titre.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.ville.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterStatus !== 'ALL') {
      result = result.filter(p => p.statut === filterStatus);
    }
    
    if (filterType !== 'ALL') {
      result = result.filter(p => p.typeBien === filterType);
    }
    
    setFilteredProperties(result);
  }, [searchQuery, filterStatus, filterType, properties]);

  const handleStatusChange = async (id: number | string, newStatus: string) => {
    try {
      await propertyService.updatePropertyStatus(id, newStatus);
      toast.success(`Statut mis à jour : ${statusLabels[newStatus] || newStatus}`);
      fetchMyProperties();
    } catch (err) {
      toast.error('Erreur lors du changement de statut.');
    }
  };
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Mon Patrimoine Immobilier</h1>
            <p className="text-sm text-slate-600 mt-1">Inventaire complet de vos actifs immobiliers</p>
          </div>
          <button
            onClick={() => navigate('/publier')}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all active:scale-95 shadow-lg">
            <Plus size={18} /> Ajouter un bien
          </button>
        </div>

        {/* Barre de Filtres */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Rechercher par titre ou ville..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-cyan-500 text-sm"
          >
            <option value="ALL">Tous les types</option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([key, val]) => (
              <option key={key} value={key}>{val}</option>
            ))}
          </select>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-cyan-500 text-sm"
          >
            <option value="ALL">Tous les statuts</option>
            {Object.entries(statusLabels).map(([key, val]) => (
              <option key={key} value={key}>{val}</option>
            ))}
          </select>
        </div>

        {/* Tableau d'Inventaire */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Désignation</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Catégorie</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Valeur</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">État Patrimonial</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mx-auto mb-2" />
                    <p className="text-slate-500">Accès à l'inventaire...</p>
                  </td>
                </tr>
              ) : filteredProperties.length > 0 ? (
                filteredProperties.map((bien) => (
                  <tr key={bien.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                          {bien.urlPhotoPrincipale ? (
                            <img src={bien.urlPhotoPrincipale} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Building2 size={24} className="text-slate-400 m-auto mt-2.5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{bien.titre}</p>
                          <p className="text-xs text-slate-500">{bien.ville}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                        {PROPERTY_TYPE_LABELS[bien.typeBien]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono font-bold text-slate-700">
                      {new Intl.NumberFormat('fr-FR').format(bien.prix)} CFA
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex w-fit px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[bien.statut]}`}>
                          {statusLabels[bien.statut]}
                        </span>
                        {bien.statut === 'PUBLIE' && (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 size={10} /> En ligne sur le marché
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/biens/${bien.id}`)}
                          className="p-2 text-slate-500 hover:bg-white hover:text-cyan-600 rounded-xl border border-transparent hover:border-cyan-100 transition-all shadow-sm group" title="Détails">
                          <Eye size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                        <button 
                          className="p-2 text-slate-500 hover:bg-white hover:text-cyan-600 rounded-xl border border-transparent hover:border-cyan-100 transition-all shadow-sm group" title="Modifier">
                          <Edit size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(bien.id, 'ARCHIVE')}
                          className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl border border-transparent hover:border-red-100 transition-all shadow-sm group" title="Retirer du patrimoine">
                          <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">
                    Aucun bien ne correspond à vos critères de recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MesBiensPage;
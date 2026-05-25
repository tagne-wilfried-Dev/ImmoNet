import React from 'react';
import { MapPin, Search, Filter, X } from 'lucide-react';

interface ExplorePageProps {
  title: string; // "Immobilier à vendre" ou "Immobilier à louer"
  mode: 'vendre' | 'louer';
}

const ExplorePage: React.FC<ExplorePageProps> = ({ title, mode }) => {
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
          <div className="lg:col-span-6 xl:col-span-5 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-cyan-100">
              <h2 className="font-semibold text-xl text-slate-900 mb-8">Filtrer votre recherche</h2>

              {/* Pays */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dans quel pays recherchez-vous ?
                </label>
                <select className="w-full px-5 py-3.5 bg-slate-50 border border-cyan-100 rounded-2xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-slate-700">
                  <option value="">Sélectionner un pays</option>
                  <option value="cm">Cameroun</option>
                  <option value="ci">Côte d'Ivoire</option>
                  <option value="sn">Sénégal</option>
                  <option value="tg">Togo</option>
                </select>
              </div>

              {/* Type de bien */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Type de bien recherché
                </label>
                <select className="w-full px-5 py-3.5 bg-slate-50 border border-cyan-100 rounded-2xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-slate-700">
                  <option value="">Sélectionner un type</option>
                  <option value="appartement">Appartement</option>
                  <option value="maison">Maison</option>
                  <option value="villa">Villa</option>
                  <option value="terrain">Terrain</option>
                  <option value="bureau">Bureau</option>
                </select>
              </div>

              {/* Ville */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Saisissez la ville où vous recherchez
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ex: Douala, Yaoundé, Bafoussam..."
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-cyan-100 rounded-2xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-slate-700"
                  />
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 w-5 h-5" />
                </div>
              </div>

              {/* Prix */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Filtrer par prix
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ex: 50 000 000 FCFA"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-cyan-100 rounded-2xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-slate-700"
                  />
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-white font-medium py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-cyan-500/30">
                  <Search className="w-5 h-5" />
                  Activer ma recherche
                </button>

                <button className="flex-1 py-4 border border-cyan-200 hover:bg-cyan-50 text-slate-700 font-medium rounded-2xl transition-all">
                  Afficher tout
                </button>
              </div>

              <div className="flex gap-3 mt-4">
                <button className="flex-1 py-3 text-cyan-600 hover:bg-cyan-50 border border-cyan-200 rounded-2xl text-sm font-medium flex items-center justify-center gap-2">
                  <Filter className="w-4 h-4" />
                  Plus de filtres
                </button>
                <button className="flex-1 py-3 text-slate-500 hover:bg-slate-100 border border-slate-200 rounded-2xl text-sm font-medium flex items-center justify-center gap-2">
                  <X className="w-4 h-4" />
                  Effacer
                </button>
              </div>
            </div>
          </div>

          {/* Colonne Carte */}
          <div className="lg:col-span-5 xl:col-span-7">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-cyan-100 h-160 relative">
              {/* Placeholder carte (à remplacer par React-Leaflet plus tard) */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585208798174-6cedd78e0198')] bg-cover bg-center">
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/40" />
              </div>
              
              {/* Overlay infos carte */}
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow flex items-center gap-3 text-sm">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                1 782 biens trouvés
              </div>

              {/* Contrôles carte (zoom, etc.) */}
              <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white rounded-2xl shadow flex items-center justify-center hover:bg-cyan-50">
                  +
                </button>
                <button className="w-10 h-10 bg-white rounded-2xl shadow flex items-center justify-center hover:bg-cyan-50">
                  −
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Résultats en bas */}
        <div className="mt-10 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-slate-600">
            Montrer <span className="font-medium text-slate-900">1 – 16</span> des <span className="font-medium text-slate-900">1 782</span> résultats
          </p>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <span className="text-slate-500">Trié par :</span>
            <select className="bg-white border border-cyan-100 rounded-2xl px-4 py-2 text-slate-700 focus:outline-none focus:border-cyan-400">
              <option>Priorité et plus récent</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
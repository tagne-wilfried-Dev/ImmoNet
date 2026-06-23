import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PropertyCard from '@/components/ui/PropertyCard';
import { favoriService } from '@/services/FavoriService';
import type { PropertySummary } from '@/lib/types/property.types';

const FavorisPage: React.FC = () => {
  const navigate = useNavigate();
  const [favoris, setFavoris] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await favoriService.getFavoris();
        setFavoris(data);
      } catch (err) {
        console.error('Erreur chargement favoris:', err);
        toast.error('Impossible de charger vos favoris.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const handleRemove = async (id: number | string) => {
    const bienId = Number(id);
    const previous = favoris;
    // Retrait optimiste
    setFavoris((prev) => prev.filter((b) => Number(b.id) !== bienId));
    try {
      await favoriService.removeFavori(bienId);
      toast.success('Retiré de vos favoris');
    } catch (err) {
      console.error('Erreur retrait favori:', err);
      setFavoris(previous);
      toast.error('Action impossible, réessayez.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h1
            className="text-2xl font-bold text-slate-900 flex items-center gap-2"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <Heart className="text-red-500 fill-red-500" size={24} />
            Mes favoris
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Retrouvez les biens que vous avez sauvegardés.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mx-auto" />
              <p className="text-sm text-slate-500">Chargement de vos favoris…</p>
            </div>
          </div>
        ) : favoris.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {favoris.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavorisToggle={handleRemove}
                isFavoris
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">Aucun favori pour l'instant</h3>
            <p className="text-sm text-slate-500">
              Parcourez les annonces et cliquez sur le cœur pour les retrouver ici.
            </p>
            <button
              onClick={() => navigate('/explorer')}
              className="mt-6 inline-flex items-center gap-2 text-cyan-600 font-bold hover:underline"
            >
              <Search size={16} />
              Explorer les biens
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FavorisPage;

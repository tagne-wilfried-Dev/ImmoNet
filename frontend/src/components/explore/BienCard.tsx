import React from 'react';
import { MapPin, Eye, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { type BienSummaryResponse, TypeOperation } from '@/types/bien.types';
import { Card } from '../ui/Card';

interface BienCardProps {
  bien: BienSummaryResponse;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
};

export const BienCard: React.FC<BienCardProps> = ({ bien }) => {
  const navigate = useNavigate();
  const isLocation = bien.typeOperation === TypeOperation.LOCATION;

  const handleCardClick = () => {
    navigate(`/biens/${bien.id}`);
  };

  return (
    <Card 
      variant="interactive" 
      className="p-0 group" 
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={bien.urlPhotoPrincipale || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop'}
          alt={bien.titre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md text-white ${
            isLocation ? 'bg-cyan-600/80' : 'bg-emerald-600/80'
          }`}>
            {isLocation ? 'À Louer' : 'À Vendre'}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/60 backdrop-blur-md text-white">
            {bien.typeBien.replace('_', ' ')}
          </span>
        </div>

        {/* Views Overlay */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-slate-600 text-xs font-medium">
          <Eye size={14} className="text-cyan-500" />
          {bien.nbVues}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-cyan-600 transition-colors">
            {bien.titre || `${bien.typeBien.replace('_', ' ')} à ${bien.ville}`}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
          <MapPin size={14} className="text-cyan-500" />
          <span className="truncate">{bien.ville}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Prix</span>
            <span className="text-lg font-display font-bold text-cyan-600">
              {formatPrice(bien.prix)}
              {isLocation && <span className="text-xs text-slate-400 font-normal"> /mois</span>}
            </span>
          </div>

          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
    </Card>
  );
};


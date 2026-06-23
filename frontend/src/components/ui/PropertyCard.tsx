import React, { useState } from 'react';
import { MapPin, Maximize2, BedDouble, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, getMediaUrl } from '@/lib/utils';
import type { PropertySummary } from '@/lib/types/property.types';
import { PROPERTY_TYPE_LABELS } from '@/lib/types/property.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrix(prix: number, typeOperation: PropertySummary['typeOperation']): string {
  const formatted = new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(prix);

  return typeOperation === 'LOCATION'
    ? `${formatted} FCFA / mois`
    : `${formatted} FCFA`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface PropertyCardProps {
  property: PropertySummary;
  /** Compact = version liste. Default = version grille (plus grande). */
  variant?: 'grid' | 'list';
  onFavorisToggle?: (id: number | string) => void;
  /** Indique si le bien est dans les favoris (cœur rempli). */
  isFavoris?: boolean;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  variant = 'grid',
  onFavorisToggle,
  isFavoris = false,
  className,
}) => {
  const [imgError, setImgError] = useState(false);

  const {
    id,
    titre,
    typeOperation,
    typeBien,
    prix,
    surface,
    nbChambres,
    urlPhotoPrincipale,
    ville,
    quartier,
  } = property;

  const photoUrl = !imgError && urlPhotoPrincipale
    ? getMediaUrl(urlPhotoPrincipale)
    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80';

  const isVente = typeOperation === 'VENTE';

  if (variant === 'list') {
    return (
      <article
        className={cn(
          'group flex gap-4 bg-white rounded-2xl border border-slate-200 overflow-hidden',
          'hover:-translate-y-0.5 hover:shadow-md hover:border-cyan-200',
          'transition-all duration-200',
          className,
        )}
      >
        {/* Image */}
        <Link to={`/biens/${id}`} className="relative w-48 shrink-0 overflow-hidden">
          <img
            src={photoUrl}
            alt={titre}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span
            className={cn(
              'absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm',
              isVente
                ? 'bg-cyan-600 text-white'
                : 'bg-emerald-600 text-white',
            )}
          >
            {isVente ? 'Vente' : 'Location'}
          </span>
        </Link>

        {/* Content */}
        <div className="flex flex-col justify-between py-4 pr-4 flex-1 min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2">
              <Link to={`/biens/${id}`}>
                <h3 className="font-display font-semibold text-slate-900 text-[15px] leading-snug line-clamp-2 hover:text-cyan-600 transition-colors">
                  {titre}
                </h3>
              </Link>
              {onFavorisToggle && (
                <button
                  onClick={() => onFavorisToggle(id)}
                  aria-label="Toggle favoris"
                  className="shrink-0 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Heart
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isFavoris ? 'text-red-500 fill-red-500' : 'text-slate-400'
                    )}
                  />
                </button>
              )}
            </div>

            <p className="flex items-center gap-1 mt-1.5 text-[13px] text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-cyan-500 shrink-0" aria-hidden="true" />
              {quartier ? `${quartier}, ` : ''}{ville}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3 text-[13px] text-slate-500">
              <span className="flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                {surface} m²
              </span>
              {nbChambres && (
                <span className="flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5" aria-hidden="true" />
                  {nbChambres} ch.
                </span>
              )}
            </div>
            <p className="font-mono text-[15px] font-semibold text-cyan-700 tabular-nums">
              {formatPrix(prix, typeOperation)}
            </p>
          </div>
        </div>
      </article>
    );
  }

  // ── Variante grid (défaut) ────────────────────────────────────────────────

  return (
    <article
      className={cn(
        'group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden',
        'hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(8,145,178,0.12)] hover:border-cyan-200',
        'transition-all duration-200',
        className,
      )}
    >
      {/* Image */}
      <Link to={`/biens/${id}`} className="relative h-52 overflow-hidden">
        <img
          src={photoUrl}
          alt={titre}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges superposés */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={cn(
              'text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm',
              isVente
                ? 'bg-cyan-600 text-white'
                : 'bg-emerald-600 text-white',
            )}
          >
            {isVente ? 'Vente' : 'Location'}
          </span>
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/90 text-slate-700 backdrop-blur-xs shadow-sm">
            {PROPERTY_TYPE_LABELS[typeBien]}
          </span>
        </div>

        {/* Favoris */}
        {onFavorisToggle && (
          <button
            onClick={() => onFavorisToggle(id)}
            aria-label="Toggle favoris"
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors backdrop-blur-xs"
          >
            <Heart
              className={cn(
                'w-4 h-4 transition-colors',
                isFavoris ? 'text-red-500 fill-red-500' : 'text-slate-400'
              )}
            />
          </button>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Titre + localisation */}
        <div>
          <Link to={`/biens/${id}`}>
            <h3 className="font-display font-semibold text-slate-900 text-[15px] leading-snug line-clamp-2 hover:text-cyan-600 transition-colors">
              {titre}
            </h3>
          </Link>
          <p className="flex items-center gap-1 mt-1.5 text-[13px] text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-cyan-500 shrink-0" aria-hidden="true" />
            {quartier ? `${quartier}, ` : ''}{ville}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-[13px] text-slate-500 border-t border-slate-100 pt-3">
          <span className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
            {surface} m²
          </span>
          {nbChambres ? (
            <span className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5" aria-hidden="true" />
              {nbChambres} ch.
            </span>
          ) : null}
        </div>

        {/* Prix */}
        <div className="flex items-center justify-between mt-auto">
          <p className="font-mono text-[15px] font-bold text-cyan-700 tabular-nums">
            {formatPrix(prix, typeOperation)}
          </p>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;

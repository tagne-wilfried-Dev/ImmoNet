import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Building2,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Home as HomeIcon,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import { Button } from '@/components/ui/Button';
import { MOCK_PROPERTIES } from '@/lib/data/mockProperties';
import type { OperationType, PropertyType } from '@/types/property.types';
import { PROPERTY_TYPE_LABELS, PAYS_OPTIONS } from '@/types/property.types';

// ─── Types internes ───────────────────────────────────────────────────────────

interface QuickSearchState {
  typeOperation: OperationType;
  pays: string;
  ville: string;
  typeBien: PropertyType | '';
}

// ─── Données statiques ────────────────────────────────────────────────────────

const STATS = [
  { value: '12 400+', label: 'Biens disponibles', icon: Building2 },
  { value: '3 800+', label: 'Propriétaires vérifiés', icon: ShieldCheck },
  { value: '28 000+', label: 'Familles logées', icon: HomeIcon },
] as const;

const VILLES_CM = ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Maroua', 'Bamenda'];

// ─── Sous-composant : Toggle Vente / Location ─────────────────────────────────

interface OperationToggleProps {
  value: OperationType;
  onChange: (v: OperationType) => void;
}

const OperationToggle: React.FC<OperationToggleProps> = ({ value, onChange }) => (
  <div className="inline-flex bg-slate-100 rounded-full p-1 gap-1">
    {(['VENTE', 'LOCATION'] as const).map((op) => (
      <button
        key={op}
        onClick={() => onChange(op)}
        className={cn(
          'px-5 py-2 rounded-full text-[14px] font-medium transition-all duration-200',
          value === op
            ? 'bg-white text-cyan-700 shadow-sm font-semibold'
            : 'text-slate-500 hover:text-slate-700',
        )}
      >
        {op === 'VENTE' ? 'Acheter' : 'Louer'}
      </button>
    ))}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [currentExplore, setCurrentExplore] = useState<'rent' | 'sell'>('sell');
  const [search, setSearch] = useState<QuickSearchState>({
    typeOperation: 'VENTE',
    pays: 'CM',
    ville: '',
    typeBien: '',
  });

  // Synchronise le toggle Header ↔ le toggle Hero
  const handleOperationChange = (op: OperationType) => {
    setSearch((prev) => ({ ...prev, typeOperation: op }));
    setCurrentExplore(op === 'VENTE' ? 'sell' : 'rent');
  };

  const handleHeaderNavigate = (type: 'rent' | 'sell') => {
    setCurrentExplore(type);
    setSearch((prev) => ({
      ...prev,
      typeOperation: type === 'sell' ? 'VENTE' : 'LOCATION',
    }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('typeOperation', search.typeOperation);
    if (search.pays) params.set('pays', search.pays);
    if (search.ville) params.set('ville', search.ville);
    if (search.typeBien) params.set('typeBien', search.typeBien);
    navigate(`/recherche?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Biens en vedette : 4 premiers du mock (alternés vente/location)
  const featuredProperties = MOCK_PROPERTIES.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header currentExplore={currentExplore} onNavigate={handleHeaderNavigate} />

      <main className="flex-1">
        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          style={{ background: 'var(--gradient-hero)' }}
          aria-label="Recherche de biens immobiliers"
        >
          {/* Cercles décoratifs — accent cyan subtil */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #a5f3fc 0%, transparent 70%)' }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 w-[320px] h-[320px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
          />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-20 sm:pb-28">
            {/* Eyebrow */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 text-[13px] font-medium text-cyan-700 bg-cyan-50 border border-cyan-200 px-4 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" aria-hidden="true" />
                Plateforme n°1 en Afrique centrale
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-center text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-slate-900 leading-[1.15] tracking-tight mb-4">
              Trouvez votre chez-vous
              <br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'var(--gradient-btn-primary)' }}>
                au Cameroun et en Afrique centrale
              </span>
            </h1>

            <p className="text-center text-slate-500 text-[17px] max-w-xl mx-auto mb-10">
              Plus de 12 400 biens à vendre et à louer. Trouvez votre prochain appartement, maison ou terrain en quelques clics.
            </p>

            {/* ── Barre de recherche ──────────────────────────────────────── */}
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.10)] border border-slate-200 overflow-hidden">
              {/* Toggle opération */}
              <div className="px-5 pt-5 pb-4 border-b border-slate-100">
                <OperationToggle
                  value={search.typeOperation}
                  onChange={handleOperationChange}
                />
              </div>

              {/* Champs */}
              <div className="flex flex-col sm:flex-row gap-0 sm:divide-x divide-slate-100">
                {/* Pays */}
                <div className="flex-1 px-5 py-4 flex flex-col gap-1.5 min-w-0">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Pays
                  </label>
                  <div className="relative">
                    <select
                      value={search.pays}
                      onChange={(e) => setSearch((p) => ({ ...p, pays: e.target.value }))}
                      className="w-full appearance-none bg-transparent font-body text-[15px] text-slate-800 outline-none pr-6 cursor-pointer"
                    >
                      {PAYS_OPTIONS.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
                  </div>
                </div>

                {/* Ville */}
                <div className="flex-[1.5] px-5 py-4 flex flex-col gap-1.5 min-w-0">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Ville ou quartier
                  </label>
                  <div className="relative flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-500 shrink-0" aria-hidden="true" />
                    <input
                      type="text"
                      value={search.ville}
                      onChange={(e) => setSearch((p) => ({ ...p, ville: e.target.value }))}
                      onKeyDown={handleKeyDown}
                      placeholder="Ex : Douala, Bastos, Akwa…"
                      list="villes-suggestions"
                      className="w-full bg-transparent font-body text-[15px] text-slate-800 placeholder:text-slate-400 outline-none"
                    />
                    <datalist id="villes-suggestions">
                      {VILLES_CM.map((v) => <option key={v} value={v} />)}
                    </datalist>
                  </div>
                </div>

                {/* Type de bien */}
                <div className="flex-1 px-5 py-4 flex flex-col gap-1.5 min-w-0">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Type de bien
                  </label>
                  <div className="relative">
                    <select
                      value={search.typeBien}
                      onChange={(e) =>
                        setSearch((p) => ({ ...p, typeBien: e.target.value as PropertyType | '' }))
                      }
                      className="w-full appearance-none bg-transparent font-body text-[15px] text-slate-800 outline-none pr-6 cursor-pointer"
                    >
                      <option value="">Tous les biens</option>
                      {(Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][]).map(
                        ([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        )
                      )}
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
                  </div>
                </div>

                {/* Bouton recherche */}
                <div className="px-4 py-3 flex items-center sm:items-stretch">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSearch}
                    className="w-full sm:w-auto gap-2 rounded-2xl"
                    aria-label="Lancer la recherche"
                  >
                    <Search className="w-5 h-5" aria-hidden="true" />
                    <span className="hidden sm:inline">Rechercher</span>
                    <span className="sm:hidden">Rechercher</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Recherche avancée */}
            <p className="text-center mt-4 text-[13px] text-slate-400">
              Besoin de plus de filtres ?{' '}
              <button
                onClick={handleSearch}
                className="text-cyan-600 font-medium hover:underline underline-offset-2 transition-colors"
              >
                Recherche avancée
              </button>
            </p>
          </div>
        </section>

        {/* ── STATS ───────────────────────────────────────────────────────── */}
        <section aria-label="Chiffres clés" className="bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-cyan-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold text-slate-900 leading-none">
                      {value}
                    </p>
                    <p className="text-[13px] text-slate-500 mt-1">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BIENS EN VEDETTE ─────────────────────────────────────────────── */}
        <section
          aria-label="Biens en vedette"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[13px] font-semibold text-cyan-600 uppercase tracking-wider mb-2">
                Sélection du moment
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Biens en vedette
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/recherche')}
              className="hidden sm:flex gap-1.5 text-cyan-700"
            >
              Voir tout
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                variant="grid"
              />
            ))}
          </div>

          {/* CTA mobile */}
          <div className="flex justify-center mt-8 sm:hidden">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/recherche')}
              className="gap-2"
            >
              Voir tous les biens
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </section>

        {/* ── CTA PRO ──────────────────────────────────────────────────────── */}
        <section
          aria-label="Devenir propriétaire pro"
          className="mx-4 sm:mx-6 lg:mx-8 mb-16 max-w-7xl lg:mx-auto"
        >
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-12 sm:px-14 sm:py-16"
            style={{ background: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 60%, #a5f3fc 100%)' }}
          >
            {/* Cercle décoratif */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5"
            />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              <div className="max-w-lg">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-[12px] font-semibold px-3 py-1.5 rounded-full mb-4">
                  <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                  Pour les propriétaires
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
                  Publiez vos biens et touchez des milliers d'acheteurs
                </h2>
                <p className="text-cyan-100 text-[15px] leading-relaxed">
                  Rejoignez 3 800 propriétaires vérifiés. Gérez vos annonces, réservations et locataires depuis un seul tableau de bord.
                </p>
              </div>

              <div className="flex flex-col gap-3 shrink-0">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="bg-white text-cyan-700 hover:bg-cyan-50 shadow-lg whitespace-nowrap"
                >
                  Devenir Pro
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
                <p className="text-center text-[12px] text-cyan-200">
                  Dès 9 900 FCFA / mois · Sans engagement
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;

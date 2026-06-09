// import React, { useState, useCallback } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Camera,
  Video,
  DollarSign,
  Calendar,
  Shield,
  Upload,
  X,
//   FileText,
  Globe,
  Ruler,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

// ─── TYPES & INITIAL STATE ───────────────────────────────────────────────────────
interface FormData {
  plan: 'starter' | 'business' | 'premium';
  country: string;
  title: string;
  description: string;
  propertyType: string;
  surface: string;
  photos: File[];
  videos: File[];
  address: string;
  price: string;
  charges: string;
  deposit: string;
  availabilityStart: string;
  availabilityEnd: string;
  minStay: string;
  maxStay: string;
  cancellationPolicy: 'flexible' | 'moderate' | 'strict';
}

const initialFormData: FormData = {
  plan: 'business',
  country: '',
  title: '',
  description: '',
  propertyType: '',
  surface: '',
  photos: [],
  videos: [],
  address: '',
  price: '',
  charges: '',
  deposit: '',
  availabilityStart: '',
  availabilityEnd: '',
  minStay: '',
  maxStay: '',
  cancellationPolicy: 'moderate',
};

const steps = [
  { id: 1, label: 'Choisissez une formule', icon: 'package' },
  { id: 2, label: 'Général', icon: 'file' },
  { id: 3, label: 'Galerie photos', icon: 'image' },
  { id: 4, label: '360° Degrés', icon: 'rotate-3d' },
  { id: 5, label: 'Localisation', icon: 'map' },
  { id: 6, label: 'Pricing', icon: 'dollar' },
  { id: 7, label: 'Réservation', icon: 'calendar' },
  { id: 8, label: 'Review & Publier', icon: 'check' },
];

// ─── COMPOSANT PRINCIPAL ─────────────────────────────────────────────────────────
export default function CreateAnnoncePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
// *******************************************************************************************
//   const updateField = (field: keyof FormData, value: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep].sort((a, b) => a - b));
    }
    if (currentStep < steps.length) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    // TODO: Intégration API POST /api/annonces + upload Cloudinary
    await new Promise((res) => setTimeout(res, 1500));
    navigate('/dashboard/annonces');
  };

  // ─── SIDEBAR STEPS ─────────────────────────────────────────────────────────────
  const StepSidebar = () => (
    <aside className="w-full lg:w-72 bg-white border-r border-slate-200 p-6 flex flex-col">
      <h2 className="font-display text-lg font-bold text-slate-900 mb-6">Publier une annonce</h2>
      <nav className="space-y-2 flex-1">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                isCurrent
                  ? 'bg-cyan-50 text-cyan-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isCompleted
                    ? 'bg-cyan-600 text-white'
                    : isCurrent
                    ? 'bg-cyan-100 text-cyan-600'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isCompleted ? <Check size={14} /> : <span className="text-xs font-bold">{step.id}</span>}
              </div>
              <span className="text-sm">{step.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500">
        {completedSteps.length} étape{completedSteps.length > 1 ? 's' : ''} complétée{completedSteps.length > 1 ? 's' : ''}
      </div>
    </aside>
  );

  // ─── FORM FOOTER ───────────────────────────────────────────────────────────────
  const FormFooter = () => (
    <div className="border-t border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
      <button
        onClick={handlePrev}
        disabled={currentStep === 1}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
          currentStep === 1
            ? 'text-slate-300 cursor-not-allowed'
            : 'text-slate-700 hover:bg-slate-50 hover:text-cyan-700'
        }`}
      >
        <ChevronLeft size={18} /> Retour
      </button>
      <span className="text-sm font-mono text-slate-500">
        {currentStep} / {steps.length}
      </span>
      <button
        onClick={currentStep === steps.length ? handlePublish : handleNext}
        disabled={isSubmitting}
        className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white text-sm font-medium rounded-full shadow-accent hover:shadow-accent-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Publication...' : currentStep === steps.length ? 'Publier l\'annonce' : 'Continuer'}
        {currentStep !== steps.length && <ChevronRight size={18} />}
      </button>
    </div>
  );

  // ─── STEP RENDERERS ────────────────────────────────────────────────────────────
  const renderStepContent = () => {
    const inputBase = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all";
    const labelBase = "block text-sm font-medium text-slate-700 mb-2";

    switch (currentStep) {
      case 1: // Plan Selection
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'starter', name: 'Starter', price: '2 500 CFA', features: ['1 annonce', 'Valide 2 mois', 'Support standard'] },
                { id: 'business', name: 'Business', price: '12 000 CFA', features: ['5 annonces', 'Valide 4 mois', 'Mise en avant'] },
                { id: 'premium', name: 'Premium', price: '24 000 CFA', features: ['Annonces illimitées', 'Valide 6 mois', 'Support prioritaire'] },
              ].map((plan) => (
                <button
                  key={plan.id}
                  // ***********************************************************************************************************************************************************************
                //   onClick={() => updateField('plan', plan.id as any)}
                  onClick={() => updateField('plan', plan.id as never)}
                  className={`p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                    formData.plan === plan.id
                      ? 'border-cyan-500 bg-cyan-50/50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-cyan-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-display text-lg font-bold text-slate-900">{plan.name}</h3>
                    {formData.plan === plan.id && <div className="w-5 h-5 rounded-full bg-cyan-600 flex items-center justify-center"><Check size={12} className="text-white"/></div>}
                  </div>
                  <p className="text-2xl font-bold text-cyan-700 mb-4">{plan.price}</p>
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check size={14} className="text-cyan-600" /> {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 text-center">Sélectionnez une formule pour continuer. Vous pourrez changer plus tard dans les paramètres.</p>
          </div>
        );

      case 2: // General
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelBase}><Globe size={16} className="inline mr-1"/> Pays</label>
                <select value={formData.country} onChange={(e) => updateField('country', e.target.value)} className={inputBase}>
                  <option value="">Sélectionner</option>
                  <option value="SN">Sénégal</option>
                  <option value="CI">Côte d'Ivoire</option>
                  <option value="CM">Cameroun</option>
                  <option value="FR">France</option>
                </select>
              </div>
              <div>
                <label className={labelBase}>Titre de votre annonce</label>
                <input type="text" placeholder="Ex: Studio moderne en centre-ville" value={formData.title} onChange={(e) => updateField('title', e.target.value)} className={inputBase} />
              </div>
            </div>
            <div>
              <label className={labelBase}>Décrivez le bien à vos futurs clients</label>
              <textarea rows={4} placeholder="Décrivez ici votre bien en étant le plus précis possible..." value={formData.description} onChange={(e) => updateField('description', e.target.value)} className={inputBase} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelBase}>Type de bien</label>
                <select value={formData.propertyType} onChange={(e) => updateField('propertyType', e.target.value)} className={inputBase}>
                  <option value="">Sélectionner</option>
                  <option value="studio">Studio</option>
                  <option value="appartement">Appartement</option>
                  <option value="maison">Maison</option>
                  <option value="bureau">Bureau</option>
                </select>
              </div>
              <div>
                <label className={labelBase}><Ruler size={16} className="inline mr-1"/> Surface (m²)</label>
                <input type="number" placeholder="Ex: 45" value={formData.surface} onChange={(e) => updateField('surface', e.target.value)} className={inputBase} />
              </div>
            </div>
          </div>
        );

      case 3: // Gallery
        return (
          <div className="space-y-8">
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-cyan-400 transition-colors cursor-pointer group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
                <Camera size={24} />
              </div>
              <p className="font-medium text-slate-900 mb-1">Galerie Photos</p>
              <p className="text-sm text-slate-500 mb-4">Glissez vos images ici ou cliquez pour parcourir</p>
              <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                if (e.target.files) updateField('photos', Array.from(e.target.files));
              }} />
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                Choisir des fichiers
              </button>
            </div>
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {formData.photos.map((file, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                    <button className="absolute top-1 right-1 p-1 bg-white/80 rounded-full hover:bg-white text-red-500" onClick={() => updateField('photos', formData.photos.filter((_, i) => i !== idx))}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
              <Video size={24} className="mx-auto mb-2 text-slate-400" />
              <p className="text-sm text-slate-600">Ajouter des vidéos (optionnel)</p>
              <input type="file" multiple accept="video/*" className="hidden" onChange={(e) => {
                if (e.target.files) updateField('videos', Array.from(e.target.files));
              }} />
            </div>
          </div>
        );

      case 4: // 360°
        return (
          <div className="space-y-6">
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-5 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0"><Rotate3D size={20}/></div>
              <div>
                <h3 className="font-semibold text-cyan-900">Visite virtuelle 360°</h3>
                <p className="text-sm text-cyan-700 mt-1">Ajoutez une visite virtuelle pour augmenter la visibilité de votre annonce de +40%.</p>
              </div>
            </div>
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
              <Upload size={32} className="mx-auto mb-3 text-slate-400" />
              <p className="font-medium text-slate-700 mb-2">Importer des images 360° ou un lien Matterport</p>
              <input type="file" accept="image/*" className="hidden" />
              <input type="text" placeholder="https://matterport.com/..." className={`${inputBase} max-w-md mx-auto mb-4`} />
              <p className="text-xs text-slate-500">Formats supportés : JPG, PNG, Equirectangular</p>
            </div>
          </div>
        );

      case 5: // Location
        return (
          <div className="space-y-6">
            <div>
              <label className={labelBase}><MapPin size={16} className="inline mr-1"/> Adresse du bien</label>
              <input type="text" placeholder="Rechercher une adresse..." value={formData.address} onChange={(e) => updateField('address', e.target.value)} className={inputBase} />
            </div>
            <div className="bg-slate-100 border border-slate-200 rounded-xl h-64 flex items-center justify-center relative overflow-hidden">
              {/* Placeholder Map - Remplacer par react-leaflet ou Google Maps plus tard */}
              <div className="text-center z-10">
                <MapPin size={40} className="mx-auto text-cyan-600 mb-2" />
                <p className="text-sm text-slate-600">Carte interactive</p>
                <p className="text-xs text-slate-400 mt-1">Glissez le marqueur pour affiner la position</p>
              </div>
              <div className="absolute inset-0 bg-linear-to-br from-cyan-50 to-slate-100 opacity-50" />
            </div>
          </div>
        );

      case 6: // Pricing
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelBase}><DollarSign size={16} className="inline mr-1"/> Prix / mois</label>
                <input type="number" placeholder="Ex: 150000" value={formData.price} onChange={(e) => updateField('price', e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Charges incluses</label>
                <input type="number" placeholder="Ex: 10000" value={formData.charges} onChange={(e) => updateField('charges', e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}><Shield size={16} className="inline mr-1"/> Dépôt de garantie</label>
                <input type="number" placeholder="Ex: 150000" value={formData.deposit} onChange={(e) => updateField('deposit', e.target.value)} className={inputBase} />
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900 mb-1">💡 Conseil pricing</p>
              <p>Un prix aligné avec le marché local augmente vos chances de location de 65%. Vérifiez les annonces similaires dans votre zone.</p>
            </div>
          </div>
        );

      case 7: // Reservation
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelBase}><Calendar size={16} className="inline mr-1"/> Disponibilité début</label>
                <input type="date" value={formData.availabilityStart} onChange={(e) => updateField('availabilityStart', e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Disponibilité fin</label>
                <input type="date" value={formData.availabilityEnd} onChange={(e) => updateField('availabilityEnd', e.target.value)} className={inputBase} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelBase}>Séjour minimum (nuits)</label>
                <input type="number" placeholder="Ex: 2" value={formData.minStay} onChange={(e) => updateField('minStay', e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Séjour maximum (nuits)</label>
                <input type="number" placeholder="Ex: 30" value={formData.maxStay} onChange={(e) => updateField('maxStay', e.target.value)} className={inputBase} />
              </div>
            </div>
            <div>
              <label className={labelBase}>Politique d'annulation</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['flexible', 'moderate', 'strict'].map((policy) => (
                  <button
                    key={policy}
                    onClick={() => updateField('cancellationPolicy', policy)}
                    className={`p-3 rounded-lg border text-sm font-medium capitalize transition-all ${
                      formData.cancellationPolicy === policy ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {policy}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 8: // Review & Publish
        return (
          <div className="space-y-6">
            <div className="bg-linear-to-br from-cyan-50 to-white border border-cyan-200 rounded-xl p-6">
              <h3 className="font-display text-lg font-bold text-slate-900 mb-4">Récapitulatif de l'annonce</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <ReviewItem label="Formule" value={formData.plan} />
                <ReviewItem label="Titre" value={formData.title} />
                <ReviewItem label="Type / Surface" value={`${formData.propertyType} • ${formData.surface} m²`} />
                <ReviewItem label="Prix" value={`${formData.price} CFA/mois`} />
                <ReviewItem label="Localisation" value={formData.address || 'Non définie'} />
                <ReviewItem label="Disponibilité" value={`${formData.availabilityStart || '?'} au ${formData.availabilityEnd || '?'}`} />
                <ReviewItem label="Politique" value={formData.cancellationPolicy} />
                <ReviewItem label="Médias" value={`${formData.photos.length} photos, ${formData.videos.length} vidéos`} />
              </div>
            </div>
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
              <Shield size={18} className="shrink-0 mt-0.5" />
              <p>En publiant, vous acceptez les <span className="underline cursor-pointer">Conditions Générales d'Utilisation</span> et la <span className="underline cursor-pointer">Politique de Confidentialité</span> d'ImmoNet. Votre annonce sera soumise à une validation rapide avant publication.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const ReviewItem = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between md:flex-col md:gap-1 pb-2 border-b border-slate-100 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900 truncate">{value}</span>
    </div>
  );

  const Rotate3D = ({ size, className }: { size: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3a9 9 0 1 0 9 9" />
      <path d="M12 3v6l6 3" />
    </svg>
  );

  // ── RENDER ────────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout userName="Wiliam Smith" userRole="PRO" notificationCount={3}>
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-slate-50">
        <StepSidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="font-display text-2xl lg:text-3xl font-bold text-slate-900 mb-8">
                  {steps[currentStep - 1].label}
                </h1>
                {renderStepContent()}
              </motion.div>
            </div>
          </main>
          <FormFooter />
        </div>
      </div>
    </DashboardLayout>
  );
}
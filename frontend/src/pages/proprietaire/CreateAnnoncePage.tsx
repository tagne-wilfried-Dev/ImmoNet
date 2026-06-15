import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Globe,
  Ruler,
  Rotate3d,
  Loader2,
  Package,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { propertyService } from '@/services/PropertyService';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  type PropertyType, 
  type OperationType, 
  type PeriodeLocation,
  PROPERTY_TYPE_LABELS 
} from '@/lib/types/property.types';

// ─── TYPES & INITIAL STATE ───────────────────────────────────────────────────────
interface FormData {
  plan: 'starter' | 'business' | 'premium';
  typeOperation: OperationType;
  country: string;
  ville: string;
  quartier: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  surface: string;
  nbPieces: string;
  nbChambres: string;
  nbSdb: string;
  etage: string;
  estMeuble: boolean;
  photos: File[];
  videos: File[];
  address: string;
  price: string;
  charges: string;
  deposit: string;
  periodeLocation: PeriodeLocation;
  availabilityStart: string;
  availabilityEnd: string;
  minStay: string;
  maxStay: string;
  cancellationPolicy: 'flexible' | 'moderate' | 'strict';
}

const initialFormData: FormData = {
  plan: 'business',
  typeOperation: 'LOCATION',
  country: 'Bénin',
  ville: '',
  quartier: '',
  title: '',
  description: '',
  propertyType: 'APPARTEMENT',
  surface: '',
  nbPieces: '',
  nbChambres: '',
  nbSdb: '',
  etage: '',
  estMeuble: false,
  photos: [],
  videos: [],
  address: '',
  price: '',
  charges: '',
  deposit: '',
  periodeLocation: 'MOIS',
  availabilityStart: '',
  availabilityEnd: '',
  minStay: '',
  maxStay: '',
  cancellationPolicy: 'moderate',
};

const steps = [
  { id: 1, label: 'Choisissez une formule', icon: Package },
  { id: 2, label: 'Général', icon: FileText },
  { id: 3, label: 'Galerie photos', icon: ImageIcon },
  { id: 4, label: '360° Degrés', icon: Rotate3d },
  { id: 5, label: 'Localisation', icon: MapPin },
  { id: 6, label: 'Pricing', icon: DollarSign },
  { id: 7, label: 'Réservation', icon: Calendar },
  { id: 8, label: 'Review & Publier', icon: Check },
];

// ─── COMPOSANT PRINCIPAL ─────────────────────────────────────────────────────────
export default function CreateAnnoncePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const constructPayload = () => {
    return {
      titre: formData.title,
      description: formData.description,
      typeOperation: formData.typeOperation,
      typeBien: formData.propertyType,
      adresse: formData.address,
      ville: formData.ville,
      quartier: formData.quartier,
      pays: formData.country,
      prix: Number(formData.price),
      caution: Number(formData.deposit) || 0,
      chargesIncluses: Number(formData.charges) > 0,
      surface: Number(formData.surface),
      nbPieces: Number(formData.nbPieces) || 0,
      nbChambres: Number(formData.nbChambres) || 0,
      nbSdb: Number(formData.nbSdb) || 0,
      etage: Number(formData.etage) || 0,
      estMeuble: formData.estMeuble,
      periodeLocation: formData.typeOperation === 'LOCATION' ? formData.periodeLocation : undefined,
    };
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.price || !formData.surface || !formData.ville) {
      toast.error('Veuillez remplir les champs obligatoires (Titre, Ville, Prix, Surface)');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = constructPayload();
      
      // 1. Création du bien (statut BROUILLON par défaut au backend)
      const createdProperty = await propertyService.createProperty(payload);
      
      // 2. Upload des photos si présentes
      if (formData.photos.length > 0) {
        toast.loading('Envoi des photos...', { id: 'upload-photos' });
        await propertyService.uploadPhotos(createdProperty.id, formData.photos);
        toast.success('Photos envoyées !', { id: 'upload-photos' });
      }

      // 3. Passage au statut PUBLIE (Vérification Quota au backend)
      await propertyService.updatePropertyStatus(createdProperty.id, 'PUBLIE');

      toast.success('Annonce publiée avec succès !');
      navigate('/dashboard/annonces');
    } catch (err: any) {
      console.error('Erreur lors de la publication:', err);
      const errorMsg = err.response?.data?.message || 'Erreur lors de la publication de l\'annonce.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true);
      const payload = constructPayload();

      const createdProperty = await propertyService.createProperty(payload);
      
      if (formData.photos.length > 0) {
        await propertyService.uploadPhotos(createdProperty.id, formData.photos);
      }

      toast.success('Brouillon enregistré avec succès.');
      navigate('/dashboard/annonces');
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde du brouillon:', err);
      toast.error('Erreur lors de la sauvegarde du brouillon.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── SIDEBAR STEPS ─────────────────────────────────────────────────────────────
  const StepSidebar = () => (
    <aside className="w-full lg:w-72 bg-white border-r border-slate-200 p-6 flex flex-col">
      <h2 className="font-display text-lg font-bold text-slate-900 mb-6">Publier une annonce</h2>
      <nav className="space-y-2 flex-1">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const StepIcon = step.icon;
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
                {isCompleted ? <Check size={14} /> : <StepIcon size={14} />}
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
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1 || isSubmitting}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
            currentStep === 1
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-700 hover:bg-slate-50 hover:text-cyan-700'
          }`}
        >
          <ChevronLeft size={18} /> Retour
        </button>
        {currentStep > 1 && (
          <button
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="text-slate-500 hover:text-cyan-600 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Sauvegarder en brouillon
          </button>
        )}
      </div>
      <span className="text-sm font-mono text-slate-500">
        {currentStep} / {steps.length}
      </span>
      <button
        onClick={currentStep === steps.length ? handlePublish : handleNext}
        disabled={isSubmitting}
        className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white text-sm font-medium rounded-full shadow-accent hover:shadow-accent-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px] justify-center"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            {currentStep === steps.length ? 'Publier l\'annonce' : 'Continuer'}
            {currentStep !== steps.length && <ChevronRight size={18} />}
          </>
        )}
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
                { id: 'starter', name: 'Starter', price: '2 500 CFA', features: ['10 annonces', 'Valide 2 mois', 'Support standard'] },
                { id: 'business', name: 'Business', price: '12 000 CFA', features: ['20 annonces', 'Valide 4 mois', 'Mise en avant'] },
                { id: 'premium', name: 'Premium', price: '24 000 CFA', features: ['40 annonces', 'Valide 6 mois', 'Support prioritaire'] },
              ].map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => updateField('plan', plan.id)}
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
            <p className="text-xs text-slate-500 text-center">Le plan GRATUIT (3 annonces) est activé par défaut si aucune formule n'est choisie.</p>
          </div>
        );

      case 2: // General
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelBase}>Type d'opération</label>
                <select 
                  value={formData.typeOperation} 
                  onChange={(e) => updateField('typeOperation', e.target.value as OperationType)} 
                  className={inputBase}
                >
                  <option value="LOCATION">À louer (Location)</option>
                  <option value="VENTE">À vendre (Vente)</option>
                </select>
              </div>
              <div>
                <label className={labelBase}><Globe size={16} className="inline mr-1"/> Pays</label>
                <select 
                  value={formData.country} 
                  onChange={(e) => updateField('country', e.target.value)} 
                  className={inputBase}
                >
                  <option value="Bénin">Bénin</option>
                  <option value="Sénégal">Sénégal</option>
                  <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                  <option value="Cameroun">Cameroun</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelBase}>Ville *</label>
                <input type="text" placeholder="Ex: Cotonou" value={formData.ville} onChange={(e) => updateField('ville', e.target.value)} className={inputBase} required />
              </div>
              <div>
                <label className={labelBase}>Titre de votre annonce *</label>
                <input type="text" placeholder="Ex: Studio moderne en centre-ville" value={formData.title} onChange={(e) => updateField('title', e.target.value)} className={inputBase} required />
              </div>
            </div>
            <div>
              <label className={labelBase}>Décrivez le bien à vos futurs clients</label>
              <textarea rows={4} placeholder="Décrivez ici votre bien..." value={formData.description} onChange={(e) => updateField('description', e.target.value)} className={inputBase} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelBase}>Type de bien</label>
                <select value={formData.propertyType} onChange={(e) => updateField('propertyType', e.target.value as PropertyType)} className={inputBase}>
                  {Object.entries(PROPERTY_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelBase}><Ruler size={16} className="inline mr-1"/> Surface (m²) *</label>
                <input type="number" placeholder="Ex: 45" value={formData.surface} onChange={(e) => updateField('surface', e.target.value)} className={inputBase} required />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={labelBase}>Pièces</label>
                <input type="number" value={formData.nbPieces} onChange={(e) => updateField('nbPieces', e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Chambres</label>
                <input type="number" value={formData.nbChambres} onChange={(e) => updateField('nbChambres', e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>SDB</label>
                <input type="number" value={formData.nbSdb} onChange={(e) => updateField('nbSdb', e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Étage</label>
                <input type="number" value={formData.etage} onChange={(e) => updateField('etage', e.target.value)} className={inputBase} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="estMeuble" 
                checked={formData.estMeuble} 
                onChange={(e) => updateField('estMeuble', e.target.checked)}
                className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500"
              />
              <label htmlFor="estMeuble" className="text-sm font-medium text-slate-700">Le bien est meublé</label>
            </div>
          </div>
        );

      case 3: // Gallery
        return (
          <div className="space-y-8">
            <div 
              className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-cyan-400 transition-colors cursor-pointer group"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
                <Camera size={24} />
              </div>
              <p className="font-medium text-slate-900 mb-1">Galerie Photos</p>
              <p className="text-sm text-slate-500 mb-4">Glissez vos images ici ou cliquez pour parcourir</p>
              <input 
                id="file-upload"
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files) {
                    const newFiles = Array.from(e.target.files);
                    updateField('photos', [...formData.photos, ...newFiles]);
                  }
                }} 
              />
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                Choisir des fichiers
              </button>
            </div>
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {formData.photos.map((file, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                    <button 
                      className="absolute top-1 right-1 p-1 bg-white/80 rounded-full hover:bg-white text-red-500 shadow-sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateField('photos', formData.photos.filter((_, i) => i !== idx));
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
              <Video size={24} className="mx-auto mb-2 text-slate-400" />
              <p className="text-sm text-slate-600 italic">L'upload de vidéo sera disponible prochainement.</p>
            </div>
          </div>
        );

      case 4: // 360° (UI Only as requested)
        return (
          <div className="space-y-6">
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-5 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                <Rotate3d size={20}/>
              </div>
              <div>
                <h3 className="font-semibold text-cyan-900">Visite virtuelle 360°</h3>
                <p className="text-sm text-cyan-700 mt-1">Ajoutez une visite virtuelle pour augmenter la visibilité de votre annonce de +40%.</p>
              </div>
            </div>
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
              <Upload size={32} className="mx-auto mb-3 text-slate-400" />
              <p className="font-medium text-slate-700 mb-2">Importer des images 360° ou un lien Matterport</p>
              <input type="text" placeholder="https://matterport.com/..." className={`${inputBase} max-w-md mx-auto mb-4`} disabled />
              <p className="text-xs text-slate-500">Fonctionnalité disponible uniquement pour les comptes Premium.</p>
            </div>
          </div>
        );

      case 5: // Location
        return (
          <div className="space-y-6">
            <div>
              <label className={labelBase}><MapPin size={16} className="inline mr-1"/> Adresse précise du bien</label>
              <input type="text" placeholder="Ex: 123 Rue de l'Etoile" value={formData.address} onChange={(e) => updateField('address', e.target.value)} className={inputBase} />
            </div>
            <div>
              <label className={labelBase}>Quartier</label>
              <input type="text" placeholder="Ex: Haie Vive" value={formData.quartier} onChange={(e) => updateField('quartier', e.target.value)} className={inputBase} />
            </div>
            <div className="bg-slate-100 border border-slate-200 rounded-xl h-64 flex items-center justify-center relative overflow-hidden">
              <div className="text-center z-10">
                <MapPin size={40} className="mx-auto text-cyan-600 mb-2" />
                <p className="text-sm font-medium text-slate-900">Module de carte bientôt disponible</p>
                <p className="text-xs text-slate-500 mt-1">La géolocalisation automatique sera activée en production.</p>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
            </div>
          </div>
        );

      case 6: // Pricing
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelBase}>
                  <DollarSign size={16} className="inline mr-1"/> 
                  {formData.typeOperation === 'LOCATION' ? 'Loyer / mois *' : 'Prix de vente *'}
                </label>
                <input type="number" placeholder="Ex: 150000" value={formData.price} onChange={(e) => updateField('price', e.target.value)} className={inputBase} required />
              </div>
              {formData.typeOperation === 'LOCATION' && (
                <div>
                  <label className={labelBase}>Période de paiement</label>
                  <select 
                    value={formData.periodeLocation} 
                    onChange={(e) => updateField('periodeLocation', e.target.value as PeriodeLocation)} 
                    className={inputBase}
                  >
                    <option value="MOIS">Par mois</option>
                    <option value="SEMAINE">Par semaine</option>
                    <option value="NUIT">Par nuit (Court séjour)</option>
                    <option value="ANNEE">Par an</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelBase}>Charges incluses (Montant estimé)</label>
                <input type="number" placeholder="Ex: 10000" value={formData.charges} onChange={(e) => updateField('charges', e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}><Shield size={16} className="inline mr-1"/> Dépôt de garantie / Caution</label>
                <input type="number" placeholder="Ex: 150000" value={formData.deposit} onChange={(e) => updateField('deposit', e.target.value)} className={inputBase} />
              </div>
            </div>
          </div>
        );

      case 7: // Reservation (UI Only for now)
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelBase}><Calendar size={16} className="inline mr-1"/> Disponible à partir du</label>
                <input type="date" value={formData.availabilityStart} onChange={(e) => updateField('availabilityStart', e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Jusqu'au (Optionnel)</label>
                <input type="date" value={formData.availabilityEnd} onChange={(e) => updateField('availabilityEnd', e.target.value)} className={inputBase} />
              </div>
            </div>
            <div>
              <label className={labelBase}>Politique d'annulation</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['flexible', 'moderate', 'strict'].map((policy) => (
                  <button
                    key={policy}
                    type="button"
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
            <div className="bg-linear-to-br from-cyan-50 to-white border border-cyan-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-display text-lg font-bold text-slate-900 mb-4">Récapitulatif de l'annonce</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <ReviewItem label="Titre" value={formData.title} />
                <ReviewItem label="Opération" value={formData.typeOperation} />
                <ReviewItem label="Type de bien" value={PROPERTY_TYPE_LABELS[formData.propertyType]} />
                <ReviewItem label="Surface" value={`${formData.surface} m²`} />
                <ReviewItem label="Localisation" value={`${formData.ville}, ${formData.country}`} />
                <ReviewItem label="Prix" value={`${new Intl.NumberFormat('fr-FR').format(Number(formData.price) || 0)} CFA`} />
                <ReviewItem label="Médias" value={`${formData.photos.length} photo(s)`} />
                <ReviewItem label="Meublé" value={formData.estMeuble ? 'Oui' : 'Non'} />
              </div>
            </div>
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
              <Shield size={18} className="shrink-0 mt-0.5" />
              <p>
                En publiant, vous confirmez que les informations fournies sont exactes. 
                Votre annonce sera visible immédiatement sous réserve de respect des 
                <span className="underline cursor-pointer ml-1 font-bold">conditions d'utilisation</span>.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const ReviewItem = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between md:flex-col md:gap-1 pb-2 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-xs uppercase tracking-wider">{label}</span>
      <span className="font-bold text-slate-900 truncate">{value || 'Non spécifié'}</span>
    </div>
  );

  // ── RENDER ────────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout userName="Utilisateur Pro" userRole="PRO" notificationCount={0}>
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-slate-50">
        <StepSidebar />
        <div className="flex-1 flex flex-col h-[calc(100vh-80px)]">
          <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold">
                      {currentStep}
                    </div>
                    <h1 className="font-display text-2xl lg:text-3xl font-bold text-slate-900">
                      {steps[currentStep - 1].label}
                    </h1>
                  </div>
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
          <FormFooter />
        </div>
      </div>
    </DashboardLayout>
  );
}

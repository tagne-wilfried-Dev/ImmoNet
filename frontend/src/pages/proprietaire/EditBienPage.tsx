import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Loader2, Save, MapPin, DollarSign, FileText, Ruler,
  Camera, X, Star, Trash2, Lock, Globe
} from 'lucide-react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { propertyService } from '@/services/PropertyService';
import { getMediaUrl } from '@/lib/utils';
import {
  type PropertyType,
  type OperationType,
  type PeriodeLocation,
  type PropertyUpdateRequest,
  type PhotoResponse,
  PROPERTY_TYPE_LABELS,
} from '@/lib/types/property.types';

interface EditFormData {
  titre: string;
  description: string;
  typeOperation: OperationType;
  typeBien: PropertyType;
  adresse: string;
  ville: string;
  quartier: string;
  prix: string;
  caution: string;
  chargesIncluses: boolean;
  prixNegoceable: boolean;
  periodeLocation: PeriodeLocation;
  surface: string;
  nbPieces: string;
  nbChambres: string;
  nbSdb: string;
  etage: string;
  estMeuble: boolean;
}

const inputBase = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed";
const labelBase = "block text-sm font-medium text-slate-700 mb-2";

const EditBienPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locked, setLocked] = useState(false); // bien ARCHIVE / VENDU
  const [form, setForm] = useState<EditFormData | null>(null);
  const [photos, setPhotos] = useState<PhotoResponse[]>([]);
  const [uploading, setUploading] = useState(false);

  const updateField = (field: keyof EditFormData, value: string | boolean) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const loadPhotos = async () => {
    if (!id) return;
    try {
      const data = await propertyService.getPropertyPhotos(id);
      setPhotos(data);
    } catch (err) {
      console.error('Erreur chargement photos:', err);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const bien = await propertyService.getPropertyById(id);

        if (bien.statut === 'ARCHIVE' || bien.statut === 'VENDU') {
          setLocked(true);
        }

        setForm({
          titre: bien.titre ?? '',
          description: bien.description ?? '',
          typeOperation: bien.typeOperation,
          typeBien: bien.typeBien,
          adresse: bien.adresse ?? '',
          ville: bien.ville ?? '',
          quartier: bien.quartier ?? '',
          prix: bien.prix != null ? String(bien.prix) : '',
          caution: bien.caution != null ? String(bien.caution) : '',
          chargesIncluses: !!bien.chargesIncluses,
          prixNegoceable: !!bien.prixNegoceable,
          periodeLocation: bien.periodeLocation ?? 'MOIS',
          surface: bien.surface != null ? String(bien.surface) : '',
          nbPieces: bien.nbPieces != null ? String(bien.nbPieces) : '',
          nbChambres: bien.nbChambres != null ? String(bien.nbChambres) : '',
          nbSdb: bien.nbSdb != null ? String(bien.nbSdb) : '',
          etage: bien.etage != null ? String(bien.etage) : '',
          estMeuble: !!bien.estMeuble,
        });

        await loadPhotos();
      } catch (err) {
        console.error('Erreur chargement du bien:', err);
        toast.error("Impossible de charger ce bien.");
        navigate('/dashboard/biens');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSave = async () => {
    if (!form || !id) return;

    if (!form.titre.trim() || !form.ville.trim() || !form.prix || !form.surface) {
      toast.error('Veuillez remplir les champs obligatoires (Titre, Ville, Prix, Surface).');
      return;
    }

    const payload: PropertyUpdateRequest = {
      titre: form.titre.trim(),
      description: form.description.trim(),
      typeOperation: form.typeOperation,
      typeBien: form.typeBien,
      adresse: form.adresse.trim() || undefined,
      ville: form.ville.trim(),
      quartier: form.quartier.trim() || undefined,
      prix: Number(form.prix),
      caution: form.caution ? Number(form.caution) : undefined,
      chargesIncluses: form.chargesIncluses,
      prixNegoceable: form.prixNegoceable,
      periodeLocation: form.typeOperation === 'LOCATION' ? form.periodeLocation : undefined,
      surface: Number(form.surface),
      nbPieces: form.nbPieces ? Number(form.nbPieces) : undefined,
      nbChambres: form.nbChambres ? Number(form.nbChambres) : undefined,
      nbSdb: form.nbSdb ? Number(form.nbSdb) : undefined,
      etage: form.etage ? Number(form.etage) : undefined,
      estMeuble: form.estMeuble,
    };

    try {
      setSaving(true);
      await propertyService.updateProperty(id, payload);
      toast.success('Bien mis à jour avec succès.');
      navigate('/dashboard/biens');
    } catch (err: any) {
      console.error('Erreur mise à jour:', err);
      const serverData = err.response?.data;
      let msg = 'Erreur lors de la mise à jour du bien.';
      if (serverData?.details && Array.isArray(serverData.details)) {
        msg = `Erreur : ${serverData.details.join(', ')}`;
      } else if (serverData?.message) {
        msg = serverData.message;
      }
      toast.error(msg, { duration: 5000 });
    } finally {
      setSaving(false);
    }
  };

  const handleAddPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0 || !id) return;
    try {
      setUploading(true);
      await propertyService.uploadPhotos(id, Array.from(files));
      toast.success('Photo(s) ajoutée(s).');
      await loadPhotos();
    } catch (err) {
      console.error('Erreur upload photo:', err);
      toast.error("Erreur lors de l'ajout des photos.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!id) return;
    if (!window.confirm('Supprimer cette photo ?')) return;
    try {
      await propertyService.deletePhoto(id, photoId);
      toast.success('Photo supprimée.');
      await loadPhotos();
    } catch (err) {
      console.error('Erreur suppression photo:', err);
      toast.error('Erreur lors de la suppression.');
    }
  };

  const handleSetMain = async (photoId: number) => {
    if (!id) return;
    try {
      await propertyService.setMainPhoto(id, photoId);
      toast.success('Photo principale définie.');
      await loadPhotos();
    } catch (err) {
      console.error('Erreur photo principale:', err);
      toast.error('Erreur lors du changement de photo principale.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-32 text-center">
          <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Chargement du bien...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!form) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/biens')}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
              title="Retour au patrimoine"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Modifier le bien</h1>
              <p className="text-sm text-slate-600">Mettez à jour les informations et les photos de votre bien</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || locked}
            className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white text-sm font-bold rounded-full shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} />}
            Enregistrer
          </button>
        </div>

        {locked && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
            <Lock size={18} className="shrink-0 mt-0.5" />
            <p>Ce bien est <strong>archivé ou vendu</strong> et ne peut plus être modifié.</p>
          </div>
        )}

        <fieldset disabled={locked} className="space-y-6">
          {/* Général */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-cyan-600" /> Informations générales
            </h2>
            <div>
              <label className={labelBase}>Titre de l'annonce *</label>
              <input type="text" value={form.titre} onChange={(e) => updateField('titre', e.target.value)} className={inputBase} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelBase}>Type d'opération</label>
                <select value={form.typeOperation} onChange={(e) => updateField('typeOperation', e.target.value as OperationType)} className={inputBase}>
                  <option value="LOCATION">À louer (Location)</option>
                  <option value="VENTE">À vendre (Vente)</option>
                </select>
              </div>
              <div>
                <label className={labelBase}>Type de bien</label>
                <select value={form.typeBien} onChange={(e) => updateField('typeBien', e.target.value as PropertyType)} className={inputBase}>
                  {Object.entries(PROPERTY_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={labelBase}>Description</label>
              <textarea rows={4} value={form.description} onChange={(e) => updateField('description', e.target.value)} className={inputBase} />
            </div>
          </section>

          {/* Localisation */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin size={18} className="text-cyan-600" /> Localisation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelBase}>Ville *</label>
                <input type="text" value={form.ville} onChange={(e) => updateField('ville', e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Quartier</label>
                <input type="text" value={form.quartier} onChange={(e) => updateField('quartier', e.target.value)} className={inputBase} />
              </div>
            </div>
            <div>
              <label className={labelBase}><Globe size={16} className="inline mr-1" /> Adresse précise</label>
              <input type="text" value={form.adresse} onChange={(e) => updateField('adresse', e.target.value)} className={inputBase} />
            </div>
          </section>

          {/* Prix & conditions */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <DollarSign size={18} className="text-cyan-600" /> Prix & conditions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelBase}>{form.typeOperation === 'LOCATION' ? 'Loyer *' : 'Prix de vente *'}</label>
                <input type="number" value={form.prix} onChange={(e) => updateField('prix', e.target.value)} className={inputBase} />
              </div>
              {form.typeOperation === 'LOCATION' && (
                <div>
                  <label className={labelBase}>Période de paiement</label>
                  <select value={form.periodeLocation} onChange={(e) => updateField('periodeLocation', e.target.value as PeriodeLocation)} className={inputBase}>
                    <option value="MOIS">Par mois</option>
                    <option value="SEMAINE">Par semaine</option>
                    <option value="NUIT">Par nuit (Court séjour)</option>
                    <option value="ANNEE">Par an</option>
                  </select>
                </div>
              )}
              <div>
                <label className={labelBase}>Caution / Dépôt de garantie</label>
                <input type="number" value={form.caution} onChange={(e) => updateField('caution', e.target.value)} className={inputBase} />
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={form.chargesIncluses} onChange={(e) => updateField('chargesIncluses', e.target.checked)} className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500" />
                Charges incluses
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={form.prixNegoceable} onChange={(e) => updateField('prixNegoceable', e.target.checked)} className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500" />
                Prix négociable
              </label>
            </div>
          </section>

          {/* Caractéristiques */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <Ruler size={18} className="text-cyan-600" /> Caractéristiques
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className={labelBase}>Surface (m²) *</label>
                <input type="number" value={form.surface} onChange={(e) => updateField('surface', e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Pièces</label>
                <input type="number" value={form.nbPieces} onChange={(e) => updateField('nbPieces', e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Chambres</label>
                <input type="number" value={form.nbChambres} onChange={(e) => updateField('nbChambres', e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Salles de bain</label>
                <input type="number" value={form.nbSdb} onChange={(e) => updateField('nbSdb', e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Étage</label>
                <input type="number" value={form.etage} onChange={(e) => updateField('etage', e.target.value)} className={inputBase} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={form.estMeuble} onChange={(e) => updateField('estMeuble', e.target.checked)} className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500" />
              Le bien est meublé
            </label>
          </section>
        </fieldset>

        {/* Photos */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <Camera size={18} className="text-cyan-600" /> Photos ({photos.length})
            </h2>
            <label className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${uploading ? 'bg-slate-100 text-slate-400 cursor-wait' : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'}`}>
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              Ajouter
              <input type="file" multiple accept="image/*" className="hidden" disabled={uploading} onChange={(e) => handleAddPhotos(e.target.files)} />
            </label>
          </div>

          {photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                  <img src={getMediaUrl(photo.url)} alt="" className="w-full h-full object-cover" />
                  {photo.estPrincipale && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-600 text-white text-[10px] font-bold rounded-full shadow">
                      <Star size={10} className="fill-white" /> Principale
                    </span>
                  )}
                  <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {!photo.estPrincipale && (
                      <button onClick={() => handleSetMain(photo.id)} className="p-2 bg-white/90 text-cyan-600 rounded-lg hover:bg-white shadow" title="Définir comme principale">
                        <Star size={16} />
                      </button>
                    )}
                    <button onClick={() => handleDeletePhoto(photo.id)} className="p-2 bg-white/90 text-red-500 rounded-lg hover:bg-white shadow" title="Supprimer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
              <X size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Aucune photo. Ajoutez-en pour valoriser votre annonce.</p>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default EditBienPage;

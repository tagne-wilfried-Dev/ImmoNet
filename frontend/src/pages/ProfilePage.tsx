// src/pages/ProfilePage.tsx
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Phone, Calendar, Pencil, X, Check, Shield } from "lucide-react";
import { userService } from "@/services/UserService";
import { type UserDto } from "@/types/user.types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";
import { AvatarInitials } from "@/components/ui/AvatarInitials";
import { ReadOnlyField } from "@/components/ui/ReadOnlyField";
import DashboardLayout from "@/components/layout/DashboardLayout";

const profileSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  telephone: z
    .string()
    .regex(/^\+?[0-9]{8,15}$/, "Numéro de téléphone invalide"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Valeur par défaut stable
const DEFAULT_USER: UserDto = {
  nom: "Chargement...",
  prenom: "",
  email: "",
  telephone: "",
  role: "CLIENT",
  dateInscription: new Date().toISOString(),
};

export function ProfilePage() {
  const [user, setUser] = useState<UserDto>(DEFAULT_USER);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      telephone: "",
    },
  });

  const syncForm = useCallback(
    (data: UserDto) => {
      reset({
        nom: data.nom ?? "",
        prenom: data.prenom ?? "",
        telephone: data.telephone ?? "",
      });
    },
    [reset],
  );

  const loadUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await userService.getCurrentUser();
      setUser(data);
      syncForm(data);
    } catch {
      toast.error("Erreur lors du chargement du profil");
    } finally {
      setIsLoading(false);
    }
  }, [syncForm]);

  useEffect(() => {
    void loadUserProfile();
  }, [loadUserProfile]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const updated = await userService.updateProfile(data);
      setUser(updated);
      syncForm(updated);
      setIsEditing(false);
      toast.success("Profil mis à jour avec succès");
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    syncForm(user);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="size-10 rounded-full border-2 border-slate-200 border-t-cyan-500 animate-spin" />
            <p className="text-[13px] text-slate-500 font-body">
              Chargement du profil…
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const formattedDate = new Date(user.dateInscription).toLocaleDateString(
    "fr-FR",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* ── En-tête de page ── */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <AvatarInitials nom={user.nom} prenom={user.prenom} />
          <div className="text-center sm:text-left">
            <h1 className="font-display text-3xl font-bold text-slate-900">
              Mon Profil
            </h1>
            <p className="text-sm text-slate-500 font-body mt-1">
              Gérez vos informations personnelles et les paramètres de votre compte.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ── Colonne Gauche : Aperçu & Statut ── */}
          <div className="space-y-6">
            <Card variant="default" className="flex flex-col gap-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest font-body">
                Statut du compte
              </p>
              
              <ReadOnlyField
                icon={<Shield size={16} className="text-cyan-600" />}
                label="Rôle actuel"
                value={user.role || 'Propriétaire'}
              />

              <ReadOnlyField
                icon={<Calendar size={16} className="text-cyan-600" />}
                label="Membre depuis"
                value={formattedDate}
              />
            </Card>

            <Card variant="default" className="bg-linear-to-br from-slate-900 to-slate-800 border-none text-white">
              <p className="text-[11px] font-semibold text-cyan-400 uppercase tracking-widest mb-2">
                Besoin d'aide ?
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Contactez notre support si vous souhaitez changer votre rôle ou supprimer votre compte définitivement.
              </p>
              <Button variant="outline" size="sm" className="mt-4 w-full border-slate-700 text-white hover:bg-slate-700">
                Contacter le support
              </Button>
            </Card>
          </div>

          {/* ── Colonne Droite : Formulaire & Détails ── */}
          <div className="md:col-span-2 space-y-6">
            <Card variant="default">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900">
                    Informations personnelles
                  </h2>
                  {!isEditing && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="gap-1.5 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
                    >
                      <Pencil size={14} />
                      Modifier
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Prénom"
                    icon={<User size={16} />}
                    placeholder="Votre prénom"
                    readOnly={!isEditing}
                    error={errors.prenom?.message}
                    {...register("prenom")}
                  />
                  <Input
                    label="Nom"
                    icon={<User size={16} />}
                    placeholder="Votre nom"
                    readOnly={!isEditing}
                    error={errors.nom?.message}
                    {...register("nom")}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Téléphone"
                    icon={<Phone size={16} />}
                    placeholder="+237 6XX XXX XXX"
                    readOnly={!isEditing}
                    error={errors.telephone?.message}
                    {...register("telephone")}
                  />
                  <ReadOnlyField
                    icon={<Mail size={16} />}
                    label="Adresse email"
                    value={user.email}
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4 border-t border-slate-50">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      <Check size={16} />
                      {isSubmitting ? "Enregistrement…" : "Enregistrer"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      <X size={16} />
                      Annuler
                    </Button>
                  </div>
                )}
              </form>
            </Card>

            <Card variant="default" className="border-l-4 border-l-cyan-500">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-cyan-50 rounded-lg shrink-0">
                  <Mail size={18} className="text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Sécurité du compte</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Votre adresse email est utilisée pour les notifications importantes et la récupération de mot de passe.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// src/pages/ProfilePage.tsx
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Phone, Calendar, Pencil, X, Check } from "lucide-react";
import { userService } from "@/services/UserService";
import { type UserDto } from "@/types/user.types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";
import { AvatarInitials } from "@/components/ui/AvatarInitials";
import { ReadOnlyField } from "@/components/ui/ReadOnlyField";

const profileSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  telephone: z
    .string()
    .regex(/^\+?[0-9]{8,15}$/, "Numéro de téléphone invalide"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Valeur par défaut stable — évite le bug setState-dans-le-rendu
const DEFAULT_USER: UserDto = {
  nom: "Mon Nom",
  prenom: "Mon Prenom",
  email: "email@mail.com",
  telephone: "698462357",
  role: "USER",
  dateInscription: "2008-01-05",
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
      console.log(data);
      setUser(data);
      syncForm(data);
    } catch {
      toast.error("Erreur lors du chargement du profil");
    } finally {
      setIsLoading(false);
    }
  }, [syncForm]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // ─── États de chargement ───────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 rounded-full border-2 border-slate-200 border-t-cyan-500 animate-spin" />
          <p className="text-[13px] text-slate-500 font-body">
            Chargement du profil…
          </p>
        </div>
      </div>
    );
  }

  // ─── Rendu principal ───────────────────────────────────────────────────────

  const formattedDate = new Date(user.dateInscription).toLocaleDateString(
    "fr-FR",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        {/* ── En-tête ── */}
        <div className="flex flex-col items-center gap-3 text-center">
          <AvatarInitials nom={user.nom} prenom={user.prenom} />
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">
              {user.nom} {user.prenom}
            </h1>
            <p className="text-[14px] text-slate-500 font-body mt-0.5">
              Membre depuis {formattedDate}
            </p>
          </div>
        </div>

        {/* ── Champs lecture seule (email + date) ── */}
        <Card variant="default" className="flex flex-col gap-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest font-body">
            Informations du compte
          </p>

          <ReadOnlyField
            icon={<Mail size={16} />}
            label="Adresse email"
            value={user.email}
          />

          <ReadOnlyField
            icon={<Mail size={16} />}
            label="Role dans la plateforme"
            value={user.role ? user.role:'Proprietaire'}
          />

          <ReadOnlyField
            icon={<Calendar size={16} />}
            label="Membre depuis"
            value={formattedDate}
          />
        </Card>

        {/* ── Formulaire profil ── */}
        <Card variant="default">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest font-body">
                Informations personnelles
              </p>
              {!isEditing && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-1.5"
                >
                  <Pencil size={14} />
                  Modifier
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
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

            <Input
              label="Téléphone"
              icon={<Phone size={16} />}
              placeholder="+237 6XX XXX XXX"
              readOnly={!isEditing}
              error={errors.telephone?.message}
              {...register("telephone")}
            />

            {isEditing && (
              <div className="flex gap-3 pt-1">
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

        {/* ── Zone dangereuse ──
        <Card variant="danger">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-[14px] font-semibold text-red-700 font-body">
                Supprimer mon compte
              </p>
              <p className="text-[13px] text-red-500 font-body leading-relaxed">
                Cette action est définitive et irréversible.
              </p>
            </div>
            <Button
              type="button"
              variant="danger"
              size="sm"
              className="shrink-0"
            >
              Supprimer
            </Button>
          </div>
        </Card> */}
      </div>
    </div>
  );
}

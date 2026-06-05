// src/pages/ProfilePage.tsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { userService } from '@/services/UserService';
import { type UserDto } from '@/types/user.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { toast } from 'sonner';

const profileSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  telephone: z.string().regex(/^\+?[0-9]{8,15}$/, 'Numéro de téléphone invalide'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const userData = await userService.getCurrentUser();
        setUser(userData);
        reset({
          nom: userData.nom,
          prenom: userData.prenom,
          telephone: userData.telephone,
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Erreur lors du chargement du profil');
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => loadUserProfile(), []);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const updatedUser = await userService.updateProfile(data);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Utilisateur non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold bg-linear-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
            Mon Profil
          </h1>
          <p className="mt-2 text-slate-400 font-body">
            Gérez vos informations personnelles
          </p>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            {/* Informations non modifiables */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-200">Email</label>
              <div className="px-4 py-3 rounded-xl bg-slate-800/50 border border-cyan-900/30 text-slate-300">
                {user.email}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-200">
                Date d'inscription
              </label>
              <div className="px-4 py-3 rounded-xl bg-slate-800/50 border border-cyan-900/30 text-slate-300 font-mono">
                {new Date(user.dateInscription).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>

            {/* Formulaire d'édition */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Input
                  label="Nom"
                  placeholder="Votre nom"
                  disabled={!isEditing}
                  error={errors.nom?.message}
                  {...register('nom')}
                />
              </div>

              <div className="space-y-2">
                <Input
                  label="Prénom"
                  placeholder="Votre prénom"
                  disabled={!isEditing}
                  error={errors.prenom?.message}
                  {...register('prenom')}
                />
              </div>

              <div className="space-y-2">
                <Input
                  label="Téléphone"
                  placeholder="+237 6XX XXX XXX"
                  disabled={!isEditing}
                  error={errors.telephone?.message}
                  {...register('telephone')}
                />
              </div>

              <div className="flex gap-3 pt-4">
                {isEditing ? (
                  <>
                    <Button
                      type="submit"
                      variant="default"
                      size="lg"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="lg"
                      className="flex-1"
                      onClick={() => {
                        setIsEditing(false);
                        reset();
                      }}
                    >
                      Annuler
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="default"
                    size="lg"
                    className="w-full"
                    onClick={() => setIsEditing(true)}
                  >
                    Modifier le profil
                  </Button>
                )}
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
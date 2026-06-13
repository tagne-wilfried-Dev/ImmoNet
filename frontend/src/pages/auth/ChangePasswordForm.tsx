// src/components/ChangePasswordForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema,type ChangePasswordFormData} from '@/lib/validations/auth';
import { userService } from '@/services/UserService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { toast } from 'sonner';





export function ChangePasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setIsSubmitting(true);
      await userService.changePassword({
        ancienMotDePasse: data.ancienMotDePasse,
        nouveauMotDePasse: data.nouveauMotDePasse,
      });
      toast.success('Mot de passe modifié avec succès');
      reset();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Erreur lors du changement de mot de passe';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-slate-900">
          Changer le mot de passe
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Mettez à jour votre mot de passe pour sécuriser votre compte
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Ancien mot de passe"
          type="password"
          placeholder="••••••••"
          error={errors.ancienMotDePasse?.message}
          {...register('ancienMotDePasse')}
        />

        <Input
          label="Nouveau mot de passe"
          type="password"
          placeholder="••••••••"
          error={errors.nouveauMotDePasse?.message}
          {...register('nouveauMotDePasse')}
        />

        <Input
          label="Confirmer le nouveau mot de passe"
          type="password"
          placeholder="••••••••"
          error={errors.confirmationMotDePasse?.message}
          {...register('confirmationMotDePasse')}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Modification...' : 'Changer le mot de passe'}
        </Button>
      </form>
    </Card>
  );
}
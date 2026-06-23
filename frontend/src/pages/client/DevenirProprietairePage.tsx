import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2, CheckCircle2, BarChart3, CalendarCheck,
  MessagesSquare, ArrowRight, Loader2, ShieldCheck, Sparkles,
} from 'lucide-react';
import { userService } from '@/services/UserService';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import DynamicHeader from '@/components/layout/DynamicHeader';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';

const AVANTAGES = [
  { icon: Building2, titre: 'Publiez vos biens', desc: 'Créez des annonces de vente ou de location et gérez tout votre patrimoine au même endroit.' },
  { icon: CalendarCheck, titre: 'Visites & réservations', desc: 'Recevez les demandes de visite et les réservations, et suivez-les jusqu’à la finalisation.' },
  { icon: BarChart3, titre: 'Tableau de bord pro', desc: 'Suivez vos statistiques : patrimoine par statut, performances et quota d’annonces.' },
  { icon: MessagesSquare, titre: 'Messagerie directe', desc: 'Échangez en direct avec les clients intéressés par vos biens.' },
];

const DevenirProprietairePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const isPro = user?.role === 'PRO' || user?.role === 'ADMIN';

  const handleBecomePro = async () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: '/devenir-proprietaire',
          message: 'Connectez-vous pour devenir propriétaire sur ImmoNet.',
        },
      });
      return;
    }

    try {
      setIsUpgrading(true);
      const updated = await userService.becomePro();
      dispatch(setUser(updated));
      toast.success('Bienvenue parmi les propriétaires ImmoNet !');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Une erreur est survenue. Réessayez.');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 flex flex-col">
      <DynamicHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 md:py-16">
        {/* Hero */}
        <section className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 text-cyan-700 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Espace propriétaire
          </span>
          <h1 className="mt-5 font-display text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
            Devenez propriétaire et publiez vos biens
          </h1>
          <p className="mt-3 text-[15px] text-slate-600 leading-relaxed">
            Passez en compte propriétaire pour mettre en location ou en vente vos biens,
            gérer vos réservations et suivre votre activité — gratuitement pour commencer.
          </p>
        </section>

        {/* Avantages */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {AVANTAGES.map(({ icon: Icon, titre, desc }) => (
            <div
              key={titre}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-cyan-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-3.5">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{titre}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </section>

        {/* Carte CTA */}
        <section className="mt-10">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md text-center max-w-xl mx-auto">
            {isPro ? (
              <>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="font-display text-xl font-bold text-slate-900">
                  Vous êtes déjà propriétaire
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Votre compte dispose déjà de l’espace propriétaire.
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="mt-5 inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-cyan-600/20 active:scale-95"
                >
                  Aller à mon tableau de bord
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 mx-auto mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h2 className="font-display text-xl font-bold text-slate-900">
                  Prêt à vous lancer ?
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  L’activation est immédiate et sans engagement. Vous démarrez avec la formule
                  <span className="font-semibold text-slate-900"> Gratuite</span> (jusqu’à 3 annonces).
                </p>
                <button
                  onClick={handleBecomePro}
                  disabled={isUpgrading}
                  className="mt-5 inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-cyan-600/20 active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                  {isUpgrading ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <ShieldCheck className="w-[18px] h-[18px]" />}
                  {isUpgrading ? 'Activation en cours…' : 'Devenir propriétaire'}
                </button>
                {!isAuthenticated && (
                  <p className="mt-4 text-xs text-slate-500">
                    Vous avez déjà un compte ?{' '}
                    <Link to="/login" className="text-cyan-600 hover:text-cyan-700 font-medium">
                      Connectez-vous
                    </Link>
                  </p>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DevenirProprietairePage;

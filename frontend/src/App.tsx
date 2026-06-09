import React, { useCallback, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/basePages/Home'
import DashboardPage from './pages/proprietaire/DashboardPage';
import AnnoncesPage from './pages/proprietaire/AnnoncesPage';
import ReservationsPage from './pages/proprietaire/ReservationsPage';
import MessagesPage from './pages/proprietaire/MessagesPage';
import TransactionsPage from './pages/proprietaire/TransactionsPage';
import ValidationsPage from './pages/proprietaire/ValidationsPage';
import CataloguePage from './pages/proprietaire/CataloguesPage';
import CreateAnnoncePage from './pages/proprietaire/CreateAnnoncePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import Appp from '@/draft';
import { ProfilePage } from '@/pages/ProfilePage';
import type { SimpleUser } from './types/user.types';
import { toast } from 'sonner';
import { userService } from './services/UserService';
import ClientDashboardPage from './pages/client/ClientDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">{title}</h1>
      <p className="text-slate-600">Page en cours de développement</p>
    </div>
  </div>
);

const App: React.FC = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<SimpleUser>(
    {
      nom: 'Wiliam Smith',
      role: 'PRO',
    }
  );

  const loadUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await userService.getCurrentUser();
      setUser({
        nom: data.nom,
        role: data.role,
      });
    } catch {
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await loadUserProfile();
    };
    init();  }, [loadUserProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 rounded-full border-2 border-slate-200 border-t-cyan-500 animate-spin" />
          <p className="text-[13px] text-slate-500 font-body">
            Chargement du tableau de bord…
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/demo" element={<Appp />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

// routes client/pro
      <Route
        path="/dashboard"
        element={
          user.role === 'CLIENT' ? (
            <ClientDashboardPage
              userName={user.nom}
              userRole="CLIENT"
              notificationCount={0}
            />
          ) : (
            <DashboardPage
              userName={user.nom}
              userRole={user.role === 'CLIENT' ? 'CLIENT' : 'PRO'}
            />
          )
        }
      />
      <Route
        path="/dashboard/favoris"
        element={
          <ClientDashboardPage
            userName={user.nom}
            userRole="CLIENT"
            notificationCount={0}
          />
        }
      />
      <Route
        path="/dashboard/locations"
        element={
          <ClientDashboardPage
            userName={user.nom}
            userRole="CLIENT"
            notificationCount={0}
          />
        }
      />
      //-----------------------------------------------------------------------------

      // routes admin
      <Route
        path="/admin"
        element={
          <AdminDashboardPage
            userName={user.nom}
            notificationCount={0}
          />
        }
      />
      // prochaine etape: créer les pages admin et les lier à ces routes
      <Route path="/admin/moderation" element={<PlaceholderPage title="File de modération" />} />
      <Route path="/admin/utilisateurs" element={<PlaceholderPage title="Gestion des utilisateurs" />} />
      <Route path="/admin/statistiques" element={<PlaceholderPage title="Statistiques" />} />
      <Route path="/admin/configuration" element={<PlaceholderPage title="Configuration" />} />

      <Route path="/mon profile" element={<ProfilePage />} />
      <Route path="/dashboard/annonces" element={<AnnoncesPage />} />
      <Route path="/dashboard/reservations" element={<ReservationsPage />} />
      <Route path="/dashboard/messages" element={<MessagesPage />} />
      <Route path="/dashboard/transactions" element={<TransactionsPage />} />
      <Route path="/dashboard/validations" element={<ValidationsPage />} />
      <Route path="/dashboard/catalogue" element={<CataloguePage />} />
      <Route path="/publier" element={<CreateAnnoncePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
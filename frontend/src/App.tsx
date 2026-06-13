import React, { useCallback, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import DashboardPage from './pages/proprietaire/DashboardPage';
import MesBiensPage from './pages/proprietaire/AnnoncesPage';
import MesAnnoncesPage from './pages/proprietaire/MesAnnoncesPage';
import ReservationsPage from './pages/proprietaire/ReservationsPage';
import MessagesPage from './pages/proprietaire/MessagesPage';
import ValidationsPage from './pages/proprietaire/ValidationsPage';
import EquipementsPage from './pages/proprietaire/CataloguesPage';
import CreateAnnoncePage from './pages/proprietaire/CreateAnnoncePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import Appp from '@/draft';
import { ProfilePage } from '@/pages/ProfilePage';
import ExploreRenting from '@/pages/explorePages/ExploreRenting';
import ExploreSellings from '@/pages/explorePages/ExploreSellings';
import PropertyDetailPage from '@/pages/explorePages/PropertyDetailPage';
import NotificationsPage from './pages/proprietaire/NotificationsPage';
import type { SimpleUser } from './types/user.types';
import { toast } from 'sonner';
import { userService } from './services/UserService';
import ClientDashboardPage from './pages/client/ClientDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboard';
import ModerationPage from './pages/admin/ModerationPage';
import { ChangePasswordForm } from './pages/auth/ChangePasswordForm';
import Home from './pages/basePages/Home';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">{title}</h1>
      <p className="text-slate-600">Page en cours de développement</p>
    </div>
  </div>
);

const ListRoutes: React.FC = () => {
  const routes = [
    { path: '/', label: 'Home' },
    { path: '/explore/vente', label: 'Explore - Vente' },
    { path: '/explore/louer', label: 'Explore - Louer' },
    { path: '/recherche', label: 'Recherche (Results)' },
    { path: '/login', label: 'Login' },
    { path: '/register', label: 'Register' },
    { path: '/reset-password', label: 'Reset Password' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/dashboard/favoris', label: 'Favoris' },
    { path: '/dashboard/locations', label: 'Locations' },
    { path: '/dashboard/biens', label: 'Mes biens' },
    { path: '/dashboard/reservations', label: 'Reservations' },
    { path: '/dashboard/messages', label: 'Messages' },
    { path: '/dashboard/transactions', label: 'Transactions' },
    { path: '/dashboard/validations', label: 'Validations' },
    { path: '/dashboard/equipements', label: 'Équipements' },
    { path: '/dashboard/notifications', label: 'Notifications' },
    { path: '/publier', label: 'Publier (Create Annonce)' },
    { path: '/profile', label: 'Profile' },
    { path: '/admin', label: 'Admin Dashboard' },
    { path: '/admin/moderation', label: 'Admin - Moderation' },
    { path: '/admin/utilisateurs', label: 'Admin - Utilisateurs' },
    { path: '/admin/statistiques', label: 'Admin - Statistiques' },
    { path: '/admin/configuration', label: 'Admin - Configuration' },
    { path: '/routes', label: 'Liste des routes' },
    { path: '/dashclient', label: 'DashboardClient' },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Liste des routes</h1>
      <ul className="space-y-2">
        {routes.map((r) => (
          <li key={r.path}>
            <Link to={r.path} className="text-cyan-700 hover:underline">
              {r.label} — <span className="text-sm text-slate-500">{r.path}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SearchResults: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const typeOperation = params.get('typeOperation');
  if (typeOperation === 'LOCATION') return <ExploreRenting />;
  return <ExploreSellings />;
};

const App: React.FC = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<SimpleUser>(
    {
      nom: 'bo124452563',
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
    init();
  }, [loadUserProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 rounded-full border-2 border-slate-200 border-t-cyan-500 animate-spin" />
          <p className="text-[13px] text-slate-500 font-body">
            Chargement…...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/routes" element={<ListRoutes />} />
        <Route path="/demo" element={<Appp />} />

        {/* routes d'authentification */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ChangePasswordForm />} />

        {/* routes client/pro */}
        <Route path="/home" element={<Home />} />
        <Route path="/dashclient" element={<ClientDashboardPage />} />
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
      {/* ----------------------------------------------------------------------------- */}

        {/* routes admin */}
        <Route
          path="/admin"
          element={
            <AdminDashboardPage
              userName={user.nom}
              notificationCount={0}
            />
          }
        />
        {/* prochaine etape: créer les pages admin et les lier à ces routes */}
        <Route
          path="/admin/moderation"
          element={
            <ModerationPage
              userName={user.nom}
              notificationCount={0}
            />
          }
        />
        <Route path="/admin/utilisateurs" element={<PlaceholderPage title="Gestion des utilisateurs" />} />
        <Route path="/admin/statistiques" element={<PlaceholderPage title="Statistiques" />} />
        <Route path="/admin/configuration" element={<PlaceholderPage title="Configuration" />} />

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/biens/:id" element={<PropertyDetailPage />} />
        <Route path="/dashboard/notifications" element={<NotificationsPage />} />
        <Route path="/explore/louer" element={<ExploreRenting />} />
        <Route path="/explore/vente" element={<ExploreSellings />} />
        <Route path="/recherche" element={<SearchResults />} />
        <Route path="/dashboard/biens" element={<MesBiensPage />} />
        <Route path="/dashboard/annonces" element={<MesAnnoncesPage />} />
        <Route path="/dashboard/reservations" element={<ReservationsPage />} />
        <Route path="/dashboard/messages" element={<MessagesPage />} />
        <Route path="/dashboard/validations" element={<ValidationsPage />} />
        <Route path="/dashboard/equipements" element={<EquipementsPage />} />
        <Route path="/publier" element={<CreateAnnoncePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
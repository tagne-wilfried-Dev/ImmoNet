import React from 'react';
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

// const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
//   <div className="flex items-center justify-center min-h-[60vh]">
//     <div className="text-center">
//       <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">{title}</h1>
//       <p className="text-slate-600">Page en cours de développement</p>
//     </div>
//   </div>
// );

const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Appp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />
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
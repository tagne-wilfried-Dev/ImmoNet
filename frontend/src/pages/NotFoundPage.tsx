import React from 'react';
import { Home, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* Illustration / Animation */}
        <div className="relative mb-12 inline-block">
          <div className="w-64 h-64 mx-auto relative">
            <div className="absolute inset-0 bg-linear-to-br from-cyan-400/10 to-cyan-600/10 rounded-[4rem] rotate-6" />
            <div className="absolute inset-0 bg-white border border-cyan-100 rounded-[4rem] flex items-center justify-center shadow-xl">
              <div className="text-center">
                <div className="text-[120px] font-display font-bold text-transparent bg-clip-text bg-linear-to-br from-cyan-400 to-cyan-600 leading-none tracking-tighter">
                  404
                </div>
                <div className="text-2xl font-medium text-slate-400 -mt-4">Page non trouvée</div>
              </div>
            </div>
          </div>
          
          {/* Halo décoratif */}
          <div className="absolute -inset-8 bg-linear-to-br from-cyan-400/20 to-transparent rounded-full blur-3xl -z-10" />
        </div>

        <h1 className="font-display text-5xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
          Oups ! On s'est perdu...
        </h1>
        
        <p className="text-xl text-slate-600 max-w-md mx-auto mb-10">
          La page que vous recherchez n'existe pas ou a été déplacée. 
          Ne vous inquiétez pas, explorons ensemble de belles propriétés.
        </p>

        {/* Actions Principales */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-linear-to-r from-cyan-600 to-cyan-400 text-white font-medium rounded-2xl hover:brightness-105 transition-all active:scale-95 shadow-lg shadow-cyan-500/30 group w-full sm:w-auto"
          >
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Retour à l'accueil
          </Link>

          <Link
            to="/explore/rent"
            className="flex items-center justify-center gap-3 px-8 py-4 border border-cyan-200 hover:border-cyan-300 text-slate-700 hover:text-cyan-600 font-medium rounded-2xl transition-all w-full sm:w-auto"
          >
            <Search className="w-5 h-5" />
            Voir les annonces
          </Link>
        </div>

        {/* Suggestion secondaire */}
        <div className="mt-12">
          <p className="text-slate-500 text-sm mb-3">Vous cherchez peut-être :</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/explore/sell" className="text-sm px-5 py-2 bg-white border border-cyan-100 hover:border-cyan-300 rounded-2xl text-slate-600 hover:text-cyan-600 transition-colors">
              Immobilier à vendre
            </Link>
            <Link to="/explore/rent" className="text-sm px-5 py-2 bg-white border border-cyan-100 hover:border-cyan-300 rounded-2xl text-slate-600 hover:text-cyan-600 transition-colors">
              Immobilier à louer
            </Link>
            <Link to="/dashboard" className="text-sm px-5 py-2 bg-white border border-cyan-100 hover:border-cyan-300 rounded-2xl text-slate-600 hover:text-cyan-600 transition-colors">
              Tableau de bord
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;
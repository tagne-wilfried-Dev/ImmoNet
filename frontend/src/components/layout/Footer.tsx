import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import Facebook from '@/assets/icons8-facebook-50.png';
import Twitter from '@/assets/icons8-x-50.png';
import Instagram from '@/assets/icons8-instagram-48.png';
import Linkedin from '@/assets/icons8-linkedin-50.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-cyan-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Colonne Logo & Description */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-md">
                <span className="text-white font-display font-bold text-2xl tracking-tighter">I</span>
              </div>
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
                  ImmoNet
                </h2>
                <p className="text-cyan-600 text-sm font-medium">Immobilier • Connecté</p>
              </div>
            </div>
            
            <p className="text-slate-600 max-w-md text-[15px] leading-relaxed mb-8">
              La plateforme immobilière de référence en Afrique centrale. 
              Trouvez ou publiez votre bien en toute confiance.
            </p>

            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <MapPin className="w-4 h-4" />
              <span>Douala, Cameroun</span>
            </div>
          </div>

          {/* Navigation Colonnes */}
          <div className="lg:col-span-2">
            <h3 className="font-medium text-slate-900 mb-5">Explorer</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="#" className="hover:text-cyan-600 transition-colors">À Vendre</a></li>
              <li><a href="#" className="hover:text-cyan-600 transition-colors">À Louer</a></li>
              <li><a href="#" className="hover:text-cyan-600 transition-colors">Annonces récentes</a></li>
              <li><a href="#" className="hover:text-cyan-600 transition-colors">Carte interactive</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-medium text-slate-900 mb-5">Pour les Propriétaires</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="#" className="hover:text-cyan-600 transition-colors">Publier une annonce</a></li>
              <li><a href="#" className="hover:text-cyan-600 transition-colors">Tableau de bord</a></li>
              <li><a href="#" className="hover:text-cyan-600 transition-colors">Devenir Pro</a></li>
              <li><a href="#" className="hover:text-cyan-600 transition-colors">Conseils propriétaires</a></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-medium text-slate-900 mb-5">Contact & Support</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-cyan-600" />
                <span>+237 6 00 00 00 00</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-cyan-600" />
                <span>contact@immonet.cm</span>
              </div>
            </div>

            {/* Réseaux Sociaux */}
            <div className="mt-8">
              <h4 className="text-sm font-medium text-slate-900 mb-4">Suivez-nous</h4>
              <div className="flex gap-4">
                <a href="#" className="w-9 h-9 bg-white border border-cyan-100 rounded-2xl flex items-center justify-center text-slate-600 hover:text-cyan-600 hover:border-cyan-200 transition-all">
                  <img src={Facebook } alt="facebooklink" />
                  
                </a>
                <a href="#" className="w-9 h-9 bg-white border border-cyan-100 rounded-2xl flex items-center justify-center text-slate-600 hover:text-cyan-600 hover:border-cyan-200 transition-all">
                  <img src={Instagram } alt="instagramlink" />
                </a>
                <a href="#" className="w-9 h-9 bg-white border border-cyan-100 rounded-2xl flex items-center justify-center text-slate-600 hover:text-cyan-600 hover:border-cyan-200 transition-all">
                  <img src={Twitter } alt="twitterlink" />
                </a>
                <a href="#" className="w-9 h-9 bg-white border border-cyan-100 rounded-2xl flex items-center justify-center text-slate-600 hover:text-cyan-600 hover:border-cyan-200 transition-all">
                  <img src={Linkedin } alt="linkedinlink" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-cyan-100 my-10" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} ImmoNet. Tous droits réservés.</p>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            <a href="#" className="hover:text-cyan-600 transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-cyan-600 transition-colors">Conditions d'utilisation</a>
            <a href="#" className="hover:text-cyan-600 transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-cyan-600 transition-colors">Nous contacter</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
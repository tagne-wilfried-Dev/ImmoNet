import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ShieldCheck, FileText, Upload, CheckCircle } from 'lucide-react';

const steps = [
  { id: 1, title: 'Identité', desc: 'Carte d\'identité ou passeport', status: 'validé' },
  { id: 2, title: 'Justificatif de domicile', desc: 'Facture récente (-3 mois)', status: 'validé' },
  { id: 3, title: 'Titre de propriété / Bail', desc: 'Document prouvant la gestion du bien', status: 'en_cours' },
  { id: 4, title: 'Compte bancaire', desc: 'RIB pour les virements', status: 'attente' },
];

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  validé: { color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle },
  en_cours: { color: 'text-amber-600 bg-amber-50', icon: FileText },
  attente: { color: 'text-slate-400 bg-slate-50', icon: Upload },
};

const ValidationsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Validations & KYC</h1>
          <p className="text-sm text-slate-600 mt-1">Vérifiez votre identité pour publier et recevoir des paiements</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Progression : 2/4 documents</h2>
              <p className="text-sm text-slate-600">Complétez les étapes restantes pour activer toutes les fonctionnalités</p>
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((step) => {
              const Config = statusConfig[step.status];
              const Icon = Config.icon;
              return (
                <div key={step.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${Config.color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{step.title}</p>
                      <p className="text-sm text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                  <button className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    step.status === 'attente' ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-slate-100 text-slate-600 cursor-default'
                  }`}>
                    {step.status === 'validé' ? 'Validé' : step.status === 'en_cours' ? 'Vérification...' : 'Télécharger'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ValidationsPage;
import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { BedDouble, Sofa, Tv, Wifi, Car, Snowflake } from 'lucide-react';

const equipements = [
  { id: 1, name: 'Lit double', icon: BedDouble, count: 12 },
  { id: 2, name: 'Canapé', icon: Sofa, count: 8 },
  { id: 3, name: 'Télévision', icon: Tv, count: 15 },
  { id: 4, name: 'Wi-Fi haut débit', icon: Wifi, count: 20 },
  { id: 5, name: 'Parking privé', icon: Car, count: 6 },
  { id: 6, name: 'Climatisation', icon: Snowflake, count: 10 },
];

const EquipementsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Vos équipements</h1>
          <p className="text-sm text-slate-600 mt-1">Gérez la liste des équipements que vous proposez dans vos biens</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {equipements.map((eq) => (
            <div key={eq.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-cyan-200 transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors mb-3">
                <eq.icon size={24} />
              </div>
              <p className="font-medium text-slate-900">{eq.name}</p>
              <p className="text-sm text-slate-500 mt-1">{eq.count} biens équipés</p>
            </div>
          ))}
          <button className="border-2 border-dashed border-slate-300 rounded-xl p-5 flex flex-col items-center justify-center text-slate-500 hover:border-cyan-400 hover:text-cyan-600 transition-colors">
            <span className="text-2xl mb-1">+</span>
            <span className="text-sm font-medium">Ajouter un équipement</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EquipementsPage;
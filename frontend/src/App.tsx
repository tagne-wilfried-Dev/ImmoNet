import React from 'react';
// import { Routes, Route} from 'react-router-dom';
import DashboardPage from './pages/proprietaire/DashboardPage';
// import Home from './pages/basePages/Home';

// Placeholder pour les autres pages
// const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
//   return (
//     <div className="flex items-center justify-center min-h-[60vh]">
//       <div className="text-center">
//         <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">
//           {title}
//         </h1>
//         <p className="text-slate-600">Page en cours de développement</p>
//       </div>
//     </div>
//   );
// };

const App: React.FC = () => {
  return (
    <DashboardPage />
    // <Routes>

    //   {/* Routes protégées Dashboard */}
    //   <Route path="/dashboard" element={<DashboardPage  />} />

    // </Routes>
  );
};

export default App;
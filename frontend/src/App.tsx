
import './App.css'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import ExploreSellings from './pages/explorePages/ExploreSellings';
import ExploreRenting from './pages/explorePages/ExploreRenting';
import { useState } from 'react';

/* pour la gestion des liens de base */
type ExploreType = 'rent' | 'sell';

function App(){
  const [currentExplore, setCurrentExplore] = useState<ExploreType>('rent');

  let content;
  if(currentExplore === 'rent') {
    content = <ExploreRenting />;
  } else if(currentExplore === 'sell') {
    content = <ExploreSellings />;
  }
  return (
    <>
      <Header currentExplore={currentExplore}
      onNavigate={setCurrentExplore} />
      <main className="container mx-auto px-6 py-12">
        {content}
      </main>
      {/* Footer */}
      <Footer />
    </>
  )
}
export default App

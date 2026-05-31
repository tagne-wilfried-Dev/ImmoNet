import Header from "@/components/layout/Header"
import { useState } from "react";
import ExploreRenting from "../explorePages/ExploreRenting";
import ExploreSellings from "../explorePages/ExploreSellings";

/* pour la gestion des liens de base */
type ExploreType = 'rent' | 'sell';
function Home() {
    const [currentExplore, setCurrentExplore] = useState<ExploreType>('rent');

    let content;
    if (currentExplore === 'rent') {
        content = <ExploreRenting />;
    } else if (currentExplore === 'sell') {
        content = <ExploreSellings />;
    }
    return (
        <div>
            <Header currentExplore={currentExplore}
                onNavigate={setCurrentExplore} />
            <main className="container mx-auto px-6 py-12">
                {content}
            </main>
        </div>
    )
}

export default Home

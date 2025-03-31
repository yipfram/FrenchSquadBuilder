import { useState, useEffect } from "react";

interface FixedPowerScoreProps {
  powerScore: number;
}

export default function FixedPowerScore({ powerScore }: FixedPowerScoreProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Ce composant sera affiché uniquement lorsque vous défilez en dessous de la section power score d'origine
  useEffect(() => {
    const handleScroll = () => {
      // Récupérer la position du power score original
      const powerScoreEl = document.getElementById('power-score');
      if (powerScoreEl) {
        const rect = powerScoreEl.getBoundingClientRect();
        // Si l'élément est au-dessus du viewport ou n'est pas visible (panel fermé), afficher le composant fixe
        const statsSection = document.querySelector('.stats-section');
        const isStatsSectionOpen = statsSection ? window.getComputedStyle(statsSection).display !== 'none' : false;
        
        setIsVisible((rect.top < 0 && isStatsSectionOpen) || 
                     (powerScoreEl.offsetParent === null && !isStatsSectionOpen));
      }
    };

    // Vérifier au chargement et lors du défilement
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    
    // Aussi vérifier lors des changements de visibilité du panel (ouverture/fermeture)
    const observer = new MutationObserver(handleScroll);
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      observer.observe(statsSection, { attributes: true, childList: false, subtree: false });
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none animate-fade-in-down">
      <div className="bg-[#002654] text-white rounded-b-md px-4 py-2 shadow-lg flex items-center space-x-3 pointer-events-auto">
        <span className="font-medium">Puissance d'Équipe</span>
        <div className="flex items-center space-x-1">
          <span className="text-xl font-bold">{powerScore}</span>
          <span className="text-sm">/100</span>
        </div>
      </div>
    </div>
  );
}
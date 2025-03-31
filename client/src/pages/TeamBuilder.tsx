import { useState } from "react";
import { useLocation } from "wouter";
import { useTeam } from "@/context/TeamContext";
import TeamInfoPanel from "@/components/TeamInfoPanel";
import SoccerFieldView from "@/components/SoccerFieldView";
import PlayerSelectionPanel from "@/components/PlayerSelectionPanel";
import SaveTeamModal from "@/components/SaveTeamModal";

export default function TeamBuilder() {
  const [, setLocation] = useLocation();
  const { selectedFormation } = useTeam();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const handleCompareTeams = () => {
    setLocation("/compare");
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#333333] flex flex-col">
      {/* Header */}
      <header className="bg-[#002654] text-white shadow-md">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 text-[#ED2939]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
              />
            </svg>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm text-gray-300 font-medium">SPORTERRE</span>
              <h1 className="font-montserrat text-lg sm:text-xl font-bold leading-tight">Créateur d'Équipe Française</h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="bg-[#ED2939] hover:bg-opacity-90 px-2 sm:px-4 py-1 sm:py-2 rounded-md text-sm sm:text-base font-medium flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zm4 9h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 112 0v3h3a1 1 0 110 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden sm:inline">Enregistrer</span>
              <span className="sm:hidden">Enreg.</span>
            </button>
            <button
              onClick={handleCompareTeams}
              className="bg-white text-[#002654] hover:bg-opacity-90 px-2 sm:px-4 py-1 sm:py-2 rounded-md text-sm sm:text-base font-medium flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v13h6a1 1 0 110 2H5a2 2 0 01-2-2V3a1 1 0 011-1zm12 4a1 1 0 011 1v11a1 1 0 11-2 0V7a1 1 0 011-1zM8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden sm:inline">Comparer</span>
              <span className="sm:hidden">Comp.</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 flex-grow">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-6">
          <TeamInfoPanel />
          <SoccerFieldView formation={selectedFormation} />
          <PlayerSelectionPanel />
        </div>
      </main>

      <SaveTeamModal 
        isOpen={isSaveModalOpen} 
        onClose={() => setIsSaveModalOpen(false)} 
      />
    </div>
  );
}

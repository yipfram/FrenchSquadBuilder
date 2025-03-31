import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTeam } from "@/context/TeamContext";
import { Player } from "@shared/schema";

export default function PlayerSelectionPanel() {
  const [positionFilter, setPositionFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { playerPositions, addPlayerToPosition } = useTeam();
  
  const { data: players, isLoading } = useQuery<Player[]>({
    queryKey: ['/api/players'],
  });

  // Define French position categories mapping
  const positionMap: Record<string, string> = {
    "GK": "GB",    // Gardien de But
    "LB": "DEF",   // Défenseur
    "CB": "DEF",   // Défenseur
    "RB": "DEF",   // Défenseur
    "CDM": "MIL",  // Milieu
    "CM": "MIL",   // Milieu
    "CAM": "MIL",  // Milieu
    "LW": "ATT",   // Attaquant
    "RW": "ATT",   // Attaquant
    "ST": "ATT"    // Attaquant
  };
  
  // French position name translation
  const positionTranslation: Record<string, string> = {
    "GK": "Gardien",
    "LB": "Latéral Gauche",
    "CB": "Défenseur Central",
    "RB": "Latéral Droit",
    "CDM": "Milieu Défensif",
    "CM": "Milieu Central",
    "CAM": "Milieu Offensif",
    "LW": "Ailier Gauche",
    "RW": "Ailier Droit",
    "ST": "Attaquant"
  };

  // Filter players by position and search query
  const filteredPlayers = players?.filter(player => {
    // Match position by category (GB, DEF, MIL, ATT)
    const matchesPosition = positionFilter ? 
      (positionFilter === "GB" ? player.position === "GK" : positionMap[player.position] === positionFilter) : 
      true;
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if player is already assigned
    const isAlreadyAssigned = playerPositions.some(pp => pp.playerId === player.id);
    
    return matchesPosition && matchesSearch && !isAlreadyAssigned;
  });

  const handlePositionFilterChange = (position: string | null) => {
    setPositionFilter(position);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePlayerSelect = (player: Player) => {
    // Find an empty position that matches the player's position
    const emptyPositions = playerPositions.filter(pp => !pp.playerId);
    const matchingPosition = emptyPositions.find(pp => {
      const positionId = pp.positionId;
      // Match position categories (e.g., CB, LB, RB all match to DEF filter)
      return positionId.includes(player.position);
    });

    if (matchingPosition) {
      addPlayerToPosition(matchingPosition.positionId, player.id);
    }
  };

  return (
    <div className="w-full lg:w-1/4 bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
        <h2 className="font-montserrat font-semibold text-base md:text-lg">Sélection des Joueurs</h2>
        <div className="relative w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Rechercher des joueurs..." 
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-8 pr-3 py-1 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002654]"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      
      <div className="mb-2 sm:mb-3">
        <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => handlePositionFilterChange(null)}
            className={`${!positionFilter ? 'bg-[#002654] text-white' : 'bg-gray-200 hover:bg-gray-300'} px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm whitespace-nowrap`}
          >
            Tous
          </button>
          <button 
            onClick={() => handlePositionFilterChange("GB")}
            className={`${positionFilter === "GB" ? 'bg-[#002654] text-white' : 'bg-gray-200 hover:bg-gray-300'} px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm whitespace-nowrap`}
          >
            GB
          </button>
          <button 
            onClick={() => handlePositionFilterChange("DEF")}
            className={`${positionFilter === "DEF" ? 'bg-[#002654] text-white' : 'bg-gray-200 hover:bg-gray-300'} px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm whitespace-nowrap`}
          >
            DEF
          </button>
          <button 
            onClick={() => handlePositionFilterChange("MIL")}
            className={`${positionFilter === "MIL" ? 'bg-[#002654] text-white' : 'bg-gray-200 hover:bg-gray-300'} px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm whitespace-nowrap`}
          >
            MIL
          </button>
          <button 
            onClick={() => handlePositionFilterChange("ATT")}
            className={`${positionFilter === "ATT" ? 'bg-[#002654] text-white' : 'bg-gray-200 hover:bg-gray-300'} px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm whitespace-nowrap`}
          >
            ATT
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-[250px] sm:max-h-[300px] md:max-h-[400px] pr-1">
        {isLoading ? (
          <div className="flex justify-center py-4 sm:py-8">
            <div className="animate-spin h-6 w-6 sm:h-8 sm:w-8 border-3 sm:border-4 border-[#002654] border-t-transparent rounded-full"></div>
          </div>
        ) : filteredPlayers && filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => (
            <div 
              key={player.id}
              onClick={() => handlePlayerSelect(player)}
              className="player-list-item flex items-center p-2 sm:p-3 border-b border-gray-200 hover:bg-[#F4F4F4] cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden mr-2 sm:mr-3 flex-shrink-0 bg-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-grow min-w-0">
                <div className="font-medium text-sm sm:text-base truncate">{player.name}</div>
                <div className="text-[10px] sm:text-xs text-gray-600 truncate">{positionTranslation[player.position]} • {player.club}</div>
              </div>
              <div className="text-xs sm:text-sm font-bold bg-[#002654] text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center flex-shrink-0 ml-1">
                {player.rating}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 sm:py-8 text-gray-500 text-sm">
            Aucun joueur ne correspond à vos critères.
          </div>
        )}
      </div>
    </div>
  );
}

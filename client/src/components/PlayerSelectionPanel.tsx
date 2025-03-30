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

  // Filter players by position and search query
  const filteredPlayers = players?.filter(player => {
    const matchesPosition = positionFilter ? player.position === positionFilter : true;
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if player is already assigned
    const isAlreadyAssigned = playerPositions.some(pp => pp.playerId === player.id);
    
    return matchesPosition && matchesSearch && !isAlreadyAssigned;
  });

  const positionMap: Record<string, string> = {
    "GK": "GK",
    "LB": "DEF",
    "CB": "DEF",
    "RB": "DEF",
    "CDM": "MID",
    "CM": "MID",
    "CAM": "MID",
    "LW": "FWD",
    "RW": "FWD",
    "ST": "FWD"
  };

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
    <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-montserrat font-semibold text-lg">Player Selection</h2>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search players..." 
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002654]"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
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
      
      <div className="mb-3">
        <div className="flex space-x-1 overflow-x-auto pb-2">
          <button 
            onClick={() => handlePositionFilterChange(null)}
            className={`${!positionFilter ? 'bg-[#002654] text-white' : 'bg-gray-200 hover:bg-gray-300'} px-3 py-1 rounded-md text-sm whitespace-nowrap`}
          >
            All
          </button>
          <button 
            onClick={() => handlePositionFilterChange("GK")}
            className={`${positionFilter === "GK" ? 'bg-[#002654] text-white' : 'bg-gray-200 hover:bg-gray-300'} px-3 py-1 rounded-md text-sm whitespace-nowrap`}
          >
            GK
          </button>
          <button 
            onClick={() => handlePositionFilterChange("DEF")}
            className={`${positionFilter === "DEF" ? 'bg-[#002654] text-white' : 'bg-gray-200 hover:bg-gray-300'} px-3 py-1 rounded-md text-sm whitespace-nowrap`}
          >
            DEF
          </button>
          <button 
            onClick={() => handlePositionFilterChange("MID")}
            className={`${positionFilter === "MID" ? 'bg-[#002654] text-white' : 'bg-gray-200 hover:bg-gray-300'} px-3 py-1 rounded-md text-sm whitespace-nowrap`}
          >
            MID
          </button>
          <button 
            onClick={() => handlePositionFilterChange("FWD")}
            className={`${positionFilter === "FWD" ? 'bg-[#002654] text-white' : 'bg-gray-200 hover:bg-gray-300'} px-3 py-1 rounded-md text-sm whitespace-nowrap`}
          >
            FWD
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-[400px] pr-1">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-[#002654] border-t-transparent rounded-full"></div>
          </div>
        ) : filteredPlayers && filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => (
            <div 
              key={player.id}
              onClick={() => handlePlayerSelect(player)}
              className="player-list-item flex items-center p-3 border-b border-gray-200 hover:bg-[#F4F4F4] cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0 bg-gray-200">
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
              <div className="flex-grow">
                <div className="font-medium">{player.name}</div>
                <div className="text-xs text-gray-600">{player.position} • {player.club}</div>
              </div>
              <div className="text-sm font-bold bg-[#002654] text-white w-7 h-7 rounded-full flex items-center justify-center">
                {player.rating}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No players found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}

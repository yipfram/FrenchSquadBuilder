import { useQuery } from "@tanstack/react-query";
import { useTeam } from "@/context/TeamContext";
import { Player } from "@shared/schema";

interface PlayerCardProps {
  positionId: string;
  playerId?: number;
  position: string;
}

export default function PlayerCard({ positionId, playerId, position }: PlayerCardProps) {
  const { removePlayerFromPosition } = useTeam();
  
  const { data: player, isLoading } = useQuery<Player>({
    queryKey: ['/api/players', playerId],
    enabled: !!playerId,
  });

  const handleRemovePlayer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playerId) {
      removePlayerFromPosition(positionId);
    }
  };

  if (!playerId) {
    return (
      <div className="player-card empty bg-white bg-opacity-50 rounded-full w-14 h-14 flex items-center justify-center shadow-md border-2 border-gray-300 hover:bg-opacity-70">
        <div className="uppercase text-xs font-bold text-gray-700">{position}</div>
      </div>
    );
  }

  if (isLoading || !player) {
    return (
      <div className="player-card bg-white rounded-full w-14 h-14 flex items-center justify-center shadow-md border-2 border-[#002654] overflow-hidden">
        <div className="animate-spin h-6 w-6 border-2 border-[#002654] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="player-card relative bg-white rounded-full w-14 h-14 flex items-center justify-center shadow-md border-2 border-[#ED2939] overflow-hidden transition-all hover:scale-105">
      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-gray-400"
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
      
      {/* Player name and rating label */}
      <div className="absolute -bottom-6 bg-[#002654] text-white text-xs py-1 px-2 rounded-md whitespace-nowrap z-10">
        {player.name.split(' ')[1] || player.name.split(' ')[0]} 
        <span className="text-yellow-300 ml-1">{player.rating}</span>
      </div>
      
      {/* Remove player button */}
      <button 
        onClick={handleRemovePlayer}
        className="absolute -top-1 -right-1 bg-[#ED2939] text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100 z-20"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

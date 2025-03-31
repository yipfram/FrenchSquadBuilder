import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTeam } from "@/context/TeamContext";
import { Player } from "@shared/schema";
import { useDrag, useDrop } from 'react-dnd';

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

// Define custom types for drag and drop
const PLAYER_DRAG_TYPE = 'player';

// Pour gérer l'affichage d'un seul nom à la fois
const playerNameVisibilityEvent = new Event('playerNameVisibility');

interface DragItem {
  type: string;
  positionId: string;
  playerId?: number;
}

interface PlayerCardProps {
  positionId: string;
  playerId?: number;
  position: string;
}

export default function PlayerCard({ positionId, playerId, position }: PlayerCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { removePlayerFromPosition, movePlayerBetweenPositions } = useTeam();
  
  // Récupération des données du joueur individuellement
  const { data: player, isLoading } = useQuery<Player>({
    queryKey: ['/api/players', playerId?.toString()],
    queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) return null;
      const response = await fetch(`/api/players/${queryKey[1]}`);
      if (!response.ok) {
        throw new Error('Failed to fetch player');
      }
      return response.json();
    },
    enabled: !!playerId,
  });
  
  // Écouter l'événement pour cacher le nom si un autre joueur est cliqué
  useEffect(() => {
    const hideOtherNames = () => {
      setShowDetails(false);
    };
    
    // Gestionnaire pour cacher les noms quand on clique ailleurs sur la page
    const handleOutsideClick = (e: MouseEvent) => {
      // Ne pas cacher si on clique sur un élément de la carte du joueur
      const isInsidePlayerCard = (e.target as Element).closest('.player-card');
      
      if (!isInsidePlayerCard) {
        setShowDetails(false);
      }
    };
    
    document.addEventListener('playerNameVisibility', hideOtherNames);
    document.addEventListener('click', handleOutsideClick);
    
    return () => {
      document.removeEventListener('playerNameVisibility', hideOtherNames);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // Set up drag functionality
  const [{ isDragging }, drag] = useDrag(() => ({
    type: PLAYER_DRAG_TYPE,
    item: { type: PLAYER_DRAG_TYPE, positionId, playerId },
    canDrag: !!playerId, // Only allow dragging if there's a player
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [positionId, playerId]);

  // Set up drop functionality
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: PLAYER_DRAG_TYPE,
    drop: (item: DragItem) => {
      if (item.positionId !== positionId) {
        movePlayerBetweenPositions(item.positionId, positionId);
      }
    },
    canDrop: (item: DragItem) => item.positionId !== positionId,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [positionId, movePlayerBetweenPositions]);

  const handleRemovePlayer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playerId) {
      removePlayerFromPosition(positionId);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (player) {
      // Si les détails sont déjà affichés pour ce joueur, les cacher
      if (showDetails) {
        setShowDetails(false);
        return;
      }
      
      // Diffuser l'événement pour masquer les noms des autres joueurs
      document.dispatchEvent(playerNameVisibilityEvent);
      // Puis afficher ce nom après un court délai
      setTimeout(() => {
        setShowDetails(true);
      }, 10);
    }
  };

  // Combine drag and drop refs
  const dragDropRef = (ref: HTMLDivElement) => {
    drag(ref);
    drop(ref);
  };

  // Styles based on drag and drop states
  const getCardStyle = () => {
    if (isDragging) {
      return "opacity-30";
    }
    if (isOver && canDrop) {
      return "ring-4 ring-green-500";
    }
    if (canDrop) {
      return "ring-2 ring-blue-300";
    }
    return "";
  };

  if (!playerId) {
    // Convert English position abbreviations to French for empty slots
    const getFrenchPosition = (pos: string) => {
      if (pos === "GK") return "GB";
      if (pos === "LB" || pos === "CB" || pos === "RB") return "DEF";
      if (pos === "CDM" || pos === "CM" || pos === "CAM") return "MIL";
      if (pos === "LW" || pos === "RW" || pos === "ST") return "ATT";
      return pos;
    };
    
    return (
      <div 
        ref={drop}
        className={`player-card empty bg-white bg-opacity-50 rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center shadow-md border-2 border-gray-300 hover:bg-opacity-70 ${isOver && canDrop ? "ring-4 ring-green-500" : ""}`}
      >
        <div className="uppercase text-xs font-bold text-gray-700">{getFrenchPosition(position)}</div>
      </div>
    );
  }

  if (isLoading || !player) {
    return (
      <div className="player-card bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center shadow-md border-2 border-[#002654] overflow-hidden">
        <div className="animate-spin h-5 w-5 md:h-6 md:w-6 border-2 border-[#002654] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={dragDropRef}
        onClick={handleClick}
        className={`player-card relative bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center shadow-md border-2 border-[#ED2939] overflow-hidden transition-all hover:scale-105 cursor-move ${getCardStyle()}`}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-gray-400"
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
        
        {/* Player number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs sm:text-sm font-bold bg-[#002654] text-white rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center">
            {player.id}
          </span>
        </div>
      </div>
      
      {/* Player details on click with remove button */}
      {showDetails && (
        <div 
          className="absolute z-30 -bottom-12 left-1/2 transform -translate-x-1/2 bg-[#002654] text-white text-xs py-1 px-2 rounded-md whitespace-nowrap shadow-md flex items-center gap-2"
          onClick={(e) => e.stopPropagation()} // Empêcher la propagation du clic
        >
          <div>
            <div className="font-bold">{player.name}</div>
            <div className="text-[10px] opacity-80">
              {positionTranslation[player.position]} • {player.club} • {player.rating}★
            </div>
          </div>
          
          {/* Remove player button moved here */}
          <button 
            onClick={handleRemovePlayer}
            className="bg-[#ED2939] text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center hover:brightness-90 transition-all"
            aria-label="Retirer le joueur"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-2 w-2 sm:h-3 sm:w-3"
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
      )}
    </div>
  );
}

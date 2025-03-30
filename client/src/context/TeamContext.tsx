import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Player, 
  Formation, 
  PlayerPosition, 
  Team 
} from "@shared/schema";
import { formations } from "@/lib/formations";
import { calculatePowerScore } from "@/lib/calculatePower";

interface TeamContextType {
  teamName: string;
  setTeamName: (name: string) => void;
  selectedFormation: Formation | null;
  setSelectedFormation: (formation: Formation) => void;
  playerPositions: PlayerPosition[];
  addPlayerToPosition: (positionId: string, playerId: number) => void;
  removePlayerFromPosition: (positionId: string) => void;
  movePlayerBetweenPositions: (fromPositionId: string, toPositionId: string) => void;
  powerScore: number;
  autoFillTeam: () => void;
  resetTeam: () => void;
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [teamName, setTeamName] = useState("My French XI");
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(formations[0]);
  const [playerPositions, setPlayerPositions] = useState<PlayerPosition[]>([]);
  const [powerScore, setPowerScore] = useState(0);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  const { data: players } = useQuery<Player[]>({
    queryKey: ['/api/players'],
  });

  useEffect(() => {
    if (selectedFormation) {
      // Initialize player positions based on formation positions
      const initialPositions: PlayerPosition[] = selectedFormation.positions.map(pos => ({
        positionId: pos.id,
        playerId: undefined
      }));
      setPlayerPositions(initialPositions);
    }
  }, [selectedFormation]);

  useEffect(() => {
    // Calculate power score whenever player positions change
    if (players) {
      const selectedPlayers = playerPositions
        .filter(pp => pp.playerId)
        .map(pp => {
          const player = players.find(p => p.id === pp.playerId);
          return player || null;
        })
        .filter((p): p is Player => p !== null);
      
      setPowerScore(calculatePowerScore(selectedPlayers));
    }
  }, [playerPositions, players]);

  // Add a player to a position
  const addPlayerToPosition = (positionId: string, playerId: number) => {
    setPlayerPositions(prevPositions => 
      prevPositions.map(pp => 
        pp.positionId === positionId 
          ? { ...pp, playerId } 
          : pp
      )
    );
  };

  // Remove a player from a position
  const removePlayerFromPosition = (positionId: string) => {
    setPlayerPositions(prevPositions => 
      prevPositions.map(pp => 
        pp.positionId === positionId 
          ? { ...pp, playerId: undefined } 
          : pp
      )
    );
  };
  
  // Move a player between positions
  const movePlayerBetweenPositions = (fromPositionId: string, toPositionId: string) => {
    setPlayerPositions(prevPositions => {
      // Find the player in the from position
      const fromPosition = prevPositions.find(pp => pp.positionId === fromPositionId);
      if (!fromPosition || !fromPosition.playerId) return prevPositions;
      
      // Get the player ID
      const playerId = fromPosition.playerId;
      
      // Create a new array with the player moved
      return prevPositions.map(pp => {
        if (pp.positionId === fromPositionId) {
          // Remove player from original position
          return { ...pp, playerId: undefined };
        } else if (pp.positionId === toPositionId) {
          // Add player to new position
          return { ...pp, playerId };
        }
        return pp;
      });
    });
  };

  // Auto-fill the team with the best available players
  const autoFillTeam = () => {
    if (!players || !selectedFormation) return;

    // Sort players by rating (highest first)
    const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);
    
    // Create a map to track which players have been assigned
    const assignedPlayers = new Set<number>();
    
    // Create new player positions array
    const newPositions = selectedFormation.positions.map(formationPos => {
      // Get position type (GK, DEF, MID, FWD)
      const positionType = formationPos.position;
      
      // Find the best unassigned player for this position
      const bestPlayer = sortedPlayers.find(player => {
        const positionMatches = positionType === player.position;
        return positionMatches && !assignedPlayers.has(player.id);
      });
      
      if (bestPlayer) {
        assignedPlayers.add(bestPlayer.id);
        return {
          positionId: formationPos.id,
          playerId: bestPlayer.id
        };
      }
      
      return {
        positionId: formationPos.id,
        playerId: undefined
      };
    });
    
    setPlayerPositions(newPositions);
  };

  // Reset the team by clearing all player selections
  const resetTeam = () => {
    if (selectedFormation) {
      const emptyPositions: PlayerPosition[] = selectedFormation.positions.map(pos => ({
        positionId: pos.id,
        playerId: undefined
      }));
      setPlayerPositions(emptyPositions);
    }
  };

  return (
    <TeamContext.Provider
      value={{
        teamName,
        setTeamName,
        selectedFormation,
        setSelectedFormation,
        playerPositions,
        addPlayerToPosition,
        removePlayerFromPosition,
        movePlayerBetweenPositions,
        powerScore,
        autoFillTeam,
        resetTeam,
        currentTeam,
        setCurrentTeam
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
}

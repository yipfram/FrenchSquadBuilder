import { useState, useEffect } from "react";
import { useTeam } from "@/context/TeamContext";
import { Player } from "@shared/schema";
import { getTeamStrategies, StrategyType } from "@/lib/teamStrategy";
import { Badge } from "@/components/ui/badge";

export default function TeamStrategyRecommendation() {
  const { playerPositions } = useTeam();
  const [strategies, setStrategies] = useState<any[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType | null>(null);

  // Récupérer les joueurs actuellement placés sur le terrain
  useEffect(() => {
    const loadingPlayerData = async () => {
      const filledPositions = playerPositions.filter(pos => pos.playerId);
      const playerPromises = filledPositions.map(async pos => {
        if (!pos.playerId) return null;
        try {
          const response = await fetch(`/api/players/${pos.playerId}`);
          if (!response.ok) throw new Error("Erreur de chargement des données");
          return await response.json();
        } catch (error) {
          console.error("Erreur:", error);
          return null;
        }
      });

      const playerData = await Promise.all(playerPromises);
      const validPlayers = playerData.filter((p): p is Player => p !== null);
      setPlayers(validPlayers);
    };

    loadingPlayerData();
  }, [playerPositions]);

  // Calculer les stratégies recommandées quand les joueurs changent
  useEffect(() => {
    if (players.length > 0) {
      const recommendedStrategies = getTeamStrategies(players);
      setStrategies(recommendedStrategies);
      
      // Sélectionner automatiquement la meilleure stratégie si aucune n'est sélectionnée
      if (!selectedStrategy && recommendedStrategies.length > 0) {
        setSelectedStrategy(recommendedStrategies[0].type);
      }
    }
  }, [players, selectedStrategy]);

  // Si pas assez de joueurs, afficher un message
  if (players.length < 7) {
    return (
      <div className="bg-white p-4 rounded-md shadow-md">
        <h3 className="text-lg font-bold text-[#002654] mb-2">Recommandation de Stratégie</h3>
        <div className="text-gray-500 text-sm">
          Placez au moins 7 joueurs sur le terrain pour obtenir des recommandations de stratégie.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h3 className="text-lg font-bold text-[#002654] mb-3">Recommandation de Stratégie</h3>
      
      <div className="space-y-4">
        {strategies.slice(0, 3).map((strategy) => (
          <div 
            key={strategy.type}
            className={`border rounded-md p-3 cursor-pointer transition-all ${
              selectedStrategy === strategy.type 
                ? "border-[#ED2939] bg-red-50" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedStrategy(strategy.type)}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{strategy.icon}</span>
                <span className="font-bold">{strategy.name}</span>
              </div>
              <Badge 
                variant={getVariantByScore(strategy.compatibilityScore) as "default" | "outline" | "secondary" | "destructive"}
                className="ml-auto"
              >
                {strategy.compatibilityScore}%
              </Badge>
            </div>
            
            <div className="h-1.5 my-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getProgressColorByScore(strategy.compatibilityScore)}`}
                style={{ width: `${strategy.compatibilityScore}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-600">{strategy.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Fonctions utilitaires pour le style basé sur le score
function getVariantByScore(score: number) {
  if (score >= 80) return "default"; // On utilise default au lieu de success puisque ce n'est pas un variant disponible
  if (score >= 60) return "secondary";
  return "outline";
}

function getProgressColorByScore(score: number) {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-blue-500";
  if (score >= 40) return "bg-yellow-500";
  return "bg-gray-500";
}
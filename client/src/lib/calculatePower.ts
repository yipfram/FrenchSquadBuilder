import { Player, Team } from "@shared/schema";
import { POSITION_WEIGHTS, POSITION_CATEGORIES } from "./constants";

// Calculate power score for a team
export function calculatePowerScore(players: Player[]): number {
  if (players.length === 0) return 0;
  
  // Base score is the average player rating
  const baseScore = players.reduce((sum, player) => sum + player.rating, 0) / players.length;
  
  // Position balance bonus
  const positionCounts = {
    GK: players.filter(p => POSITION_CATEGORIES.GK.includes(p.position)).length,
    DEF: players.filter(p => POSITION_CATEGORIES.DEF.includes(p.position)).length,
    MID: players.filter(p => POSITION_CATEGORIES.MID.includes(p.position)).length,
    FWD: players.filter(p => POSITION_CATEGORIES.FWD.includes(p.position)).length
  };
  
  // Apply position weights
  let weightedScore = 0;
  let totalWeight = 0;
  
  for (const [position, count] of Object.entries(positionCounts)) {
    const positionPlayers = players.filter(p => 
      POSITION_CATEGORIES[position as keyof typeof POSITION_CATEGORIES].includes(p.position)
    );
    
    if (positionPlayers.length > 0) {
      const positionRating = positionPlayers.reduce((sum, p) => sum + p.rating, 0) / positionPlayers.length;
      const weight = POSITION_WEIGHTS[position as keyof typeof POSITION_WEIGHTS] * count;
      
      weightedScore += positionRating * weight;
      totalWeight += weight;
    }
  }
  
  const finalScore = totalWeight > 0 ? weightedScore / totalWeight : baseScore;
  
  // Chemistry bonus based on completeness of the team (11 players)
  const completenessBonus = players.length / 11;
  
  // Final score with completeness bonus, scaled to 0-100
  return Math.round(finalScore * completenessBonus);
}

// Calculate detailed team power stats for comparison view
export function calculateTeamPowerStats(team: Team) {
  // This is a simplified version for the comparison view
  // In a real implementation, we'd calculate these based on actual player attributes
  
  // Generate realistic values based on the team power score
  const powerBase = team.powerScore;
  
  return [
    { name: "Attack", value: Math.min(100, powerBase + Math.floor(Math.random() * 5)) },
    { name: "Midfield", value: Math.min(100, powerBase + Math.floor(Math.random() * 5 - 2)) },
    { name: "Defense", value: Math.min(100, powerBase + Math.floor(Math.random() * 5 - 3)) },
    { name: "Chemistry", value: Math.min(100, powerBase + Math.floor(Math.random() * 10)) },
  ];
}

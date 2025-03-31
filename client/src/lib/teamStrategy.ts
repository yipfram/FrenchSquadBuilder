import { Player, PlayerPosition } from "@shared/schema";
import { POSITION_WEIGHTS } from "./constants";

// Étendre le type Player pour inclure les attributs supplémentaires
interface PlayerWithAttributes extends Player {
  pace?: number;
  dribbling?: number;
  passing?: number;
  physical?: number;
  defending?: number;
}

// Types des stratégies disponibles
export type StrategyType = 
  | "possession" 
  | "contreAttaque" 
  | "pressing" 
  | "defensive" 
  | "offensive" 
  | "equilibree";

interface TeamStrategy {
  type: StrategyType;
  name: string;
  description: string;
  icon: string;
  compatibilityScore: number;  // Score entre 0 et 100
}

interface PositionStrengths {
  defense: number;
  milieu: number;
  attaque: number;
  vitesse: number;
  technique: number;
  physique: number;
}

// Positions anglaises aux catégories françaises pour le calcul des poids
const positionCategoryMap: Record<string, keyof typeof POSITION_WEIGHTS> = {
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

// Calcule les forces de l'équipe par secteur 
function calculateTeamStrengths(players: Player[]): PositionStrengths {
  // Valeurs par défaut
  const strengths: PositionStrengths = {
    defense: 0,
    milieu: 0,
    attaque: 0,
    vitesse: 0, 
    technique: 0,
    physique: 0
  };

  if (!players || players.length === 0) {
    return strengths;
  }

  let totalWeight = 0;

  players.forEach(player => {
    if (!player) return;

    // Conversion de la position en catégorie pour les poids
    const positionCategory = positionCategoryMap[player.position] || "MID";
    const weight = POSITION_WEIGHTS[positionCategory] || 1;
    totalWeight += weight;

    // Calcul basé sur la position
    if (["GK", "LB", "CB", "RB"].includes(player.position)) {
      strengths.defense += player.rating * weight;
    } else if (["CDM", "CM", "CAM"].includes(player.position)) {
      strengths.milieu += player.rating * weight;
    } else if (["LW", "RW", "ST"].includes(player.position)) {
      strengths.attaque += player.rating * weight;
    }

    // Pour les attributs que nous n'avons pas, nous utilisons le rating comme valeur approximative
    const extendedPlayer = player as PlayerWithAttributes;
    
    // Attributs généraux
    strengths.vitesse += (extendedPlayer.pace || player.rating * 0.8) * weight;
    strengths.technique += ((extendedPlayer.dribbling || player.rating * 0.7) + 
                           (extendedPlayer.passing || player.rating * 0.7)) / 2 * weight;
    strengths.physique += ((extendedPlayer.physical || player.rating * 0.6) + 
                          (extendedPlayer.defending || player.rating * 0.6)) / 2 * weight;
  });

  // Normalisation
  if (totalWeight > 0) {
    strengths.defense = Math.round(strengths.defense / totalWeight);
    strengths.milieu = Math.round(strengths.milieu / totalWeight);
    strengths.attaque = Math.round(strengths.attaque / totalWeight);
    strengths.vitesse = Math.round(strengths.vitesse / totalWeight);
    strengths.technique = Math.round(strengths.technique / totalWeight);
    strengths.physique = Math.round(strengths.physique / totalWeight);
  }

  return strengths;
}

// Stratégies disponibles
const strategies: Record<StrategyType, Omit<TeamStrategy, "compatibilityScore">> = {
  possession: {
    type: "possession",
    name: "Possession",
    description: "Dominez le match avec des passes courtes et une construction patiente du jeu.",
    icon: "📊",
  },
  contreAttaque: {
    type: "contreAttaque",
    name: "Contre-Attaque",
    description: "Absorbez la pression et frappez rapidement en utilisant la vitesse de vos attaquants.",
    icon: "⚡",
  },
  pressing: {
    type: "pressing",
    name: "Pressing Haut",
    description: "Exercez une pression constante sur l'adversaire pour récupérer le ballon dans son camp.",
    icon: "🔄",
  },
  defensive: {
    type: "defensive",
    name: "Bloc Bas",
    description: "Adoptez une posture défensive solide et minimisez les espaces entre les lignes.",
    icon: "🛡️",
  },
  offensive: {
    type: "offensive",
    name: "Jeu Offensif",
    description: "Maximisez les occasions de but avec un jeu direct et des ailiers percutants.",
    icon: "⚔️",
  },
  equilibree: {
    type: "equilibree",
    name: "Équilibrée",
    description: "Stratégie polyvalente adaptée à presque toutes les situations de jeu.",
    icon: "⚖️",
  }
};

// Calculer la compatibilité d'une stratégie en fonction des forces de l'équipe
function calculateStrategyCompatibility(
  strategyType: StrategyType, 
  strengths: PositionStrengths
): number {
  let score = 0;

  switch (strategyType) {
    case "possession":
      // La possession privilégie la technique et un milieu fort
      score = (strengths.technique * 0.5) + (strengths.milieu * 0.3) + (strengths.physique * 0.2);
      break;
    
    case "contreAttaque":
      // La contre-attaque privilégie la vitesse et l'attaque
      score = (strengths.vitesse * 0.5) + (strengths.attaque * 0.3) + (strengths.defense * 0.2);
      break;
    
    case "pressing":
      // Le pressing privilégie le physique et un milieu fort
      score = (strengths.physique * 0.4) + (strengths.milieu * 0.4) + (strengths.vitesse * 0.2);
      break;
    
    case "defensive":
      // Le jeu défensif privilégie la défense et le physique
      score = (strengths.defense * 0.5) + (strengths.physique * 0.3) + (strengths.milieu * 0.2);
      break;
    
    case "offensive":
      // Le jeu offensif privilégie l'attaque et la technique
      score = (strengths.attaque * 0.5) + (strengths.technique * 0.3) + (strengths.vitesse * 0.2);
      break;
    
    case "equilibree":
      // La stratégie équilibrée fonctionne avec un peu de tout
      score = (strengths.defense * 0.2) + (strengths.milieu * 0.2) + 
              (strengths.attaque * 0.2) + (strengths.technique * 0.2) + 
              (strengths.vitesse * 0.1) + (strengths.physique * 0.1);
      break;
  }

  // Normalisation à une échelle de 0-100
  return Math.min(100, Math.max(0, Math.round(score * 1.2)));
}

// Obtenir toutes les stratégies recommandées pour une équipe, triées par compatibilité
export function getTeamStrategies(players: Player[]): TeamStrategy[] {
  const strengths = calculateTeamStrengths(players);
  
  // Calculer la compatibilité pour chaque stratégie
  const compatibleStrategies = Object.entries(strategies).map(([key, strategy]) => {
    const type = key as StrategyType;
    const compatibilityScore = calculateStrategyCompatibility(type, strengths);
    
    return {
      ...strategy,
      compatibilityScore
    };
  });
  
  // Trier par score de compatibilité (du plus élevé au plus bas)
  return compatibleStrategies.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}

// Obtenir la meilleure stratégie recommandée
export function getBestStrategyForTeam(players: Player[]): TeamStrategy | null {
  const strategies = getTeamStrategies(players);
  return strategies.length > 0 ? strategies[0] : null;
}

// Obtenir les forces de l'équipe formatées pour l'affichage
export function getTeamStrengthsForDisplay(players: Player[]): PositionStrengths {
  return calculateTeamStrengths(players);
}
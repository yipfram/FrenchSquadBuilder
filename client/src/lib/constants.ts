// Color constants
export const COLORS = {
  frenchBlue: "#002654",
  frenchRed: "#ED2939",
  frenchWhite: "#FFFFFF",
  background: "#F4F4F4",
  text: "#333333"
};

// Player position categories
export const POSITION_CATEGORIES = {
  GK: ["GK"],
  DEF: ["LB", "CB", "RB"],
  MID: ["CDM", "CM", "CAM"],
  FWD: ["LW", "ST", "RW"]
};

// Position weights for power calculation
export const POSITION_WEIGHTS = {
  GK: 1.0,
  DEF: 1.0,
  MID: 1.0,
  FWD: 1.2  // Forwards weighted slightly higher
};

// Team stats categories
export const TEAM_STATS = [
  { name: "Attack", key: "attack" },
  { name: "Midfield", key: "midfield" },
  { name: "Defense", key: "defense" },
  { name: "Chemistry", key: "chemistry" }
];

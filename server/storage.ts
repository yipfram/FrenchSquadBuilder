import { 
  players, 
  teams, 
  type Player, 
  type InsertPlayer,
  type Team,
  type InsertTeam
} from "@shared/schema";

export interface IStorage {
  // Player operations
  getAllPlayers(): Promise<Player[]>;
  getPlayersByPosition(position: string): Promise<Player[]>;
  getPlayerById(id: number): Promise<Player | undefined>;
  
  // Team operations
  getAllTeams(): Promise<Team[]>;
  getTeamById(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, team: Partial<InsertTeam>): Promise<Team | undefined>;
  deleteTeam(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private players: Map<number, Player>;
  private teams: Map<number, Team>;
  private playerCurrentId: number;
  private teamCurrentId: number;

  constructor() {
    this.players = new Map();
    this.teams = new Map();
    this.playerCurrentId = 1;
    this.teamCurrentId = 1;
    
    // Initialize with some French national team players
    this.initializePlayers();
  }

  private initializePlayers() {
    const frenchPlayers: InsertPlayer[] = [
      { name: "Hugo Lloris", position: "GK", club: "Tottenham Hotspur", rating: 88, imageUrl: "https://via.placeholder.com/150" },
      { name: "Mike Maignan", position: "GK", club: "AC Milan", rating: 84, imageUrl: "https://via.placeholder.com/150" },
      { name: "Lucas Hernandez", position: "LB", club: "Bayern Munich", rating: 84, imageUrl: "https://via.placeholder.com/150" },
      { name: "Theo Hernandez", position: "LB", club: "AC Milan", rating: 85, imageUrl: "https://via.placeholder.com/150" },
      { name: "Lucas Digne", position: "LB", club: "Aston Villa", rating: 82, imageUrl: "https://via.placeholder.com/150" },
      { name: "Raphael Varane", position: "CB", club: "Manchester United", rating: 86, imageUrl: "https://via.placeholder.com/150" },
      { name: "Dayot Upamecano", position: "CB", club: "Bayern Munich", rating: 82, imageUrl: "https://via.placeholder.com/150" },
      { name: "Presnel Kimpembe", position: "CB", club: "PSG", rating: 83, imageUrl: "https://via.placeholder.com/150" },
      { name: "William Saliba", position: "CB", club: "Arsenal", rating: 80, imageUrl: "https://via.placeholder.com/150" },
      { name: "Benjamin Pavard", position: "RB", club: "Bayern Munich", rating: 82, imageUrl: "https://via.placeholder.com/150" },
      { name: "Jules Koundé", position: "RB", club: "Barcelona", rating: 84, imageUrl: "https://via.placeholder.com/150" },
      { name: "N'Golo Kanté", position: "CDM", club: "Chelsea", rating: 88, imageUrl: "https://via.placeholder.com/150" },
      { name: "Aurélien Tchouaméni", position: "CDM", club: "Real Madrid", rating: 82, imageUrl: "https://via.placeholder.com/150" },
      { name: "Paul Pogba", position: "CM", club: "Juventus", rating: 87, imageUrl: "https://via.placeholder.com/150" },
      { name: "Adrien Rabiot", position: "CM", club: "Juventus", rating: 83, imageUrl: "https://via.placeholder.com/150" },
      { name: "Eduardo Camavinga", position: "CM", club: "Real Madrid", rating: 80, imageUrl: "https://via.placeholder.com/150" },
      { name: "Antoine Griezmann", position: "CAM", club: "Atletico Madrid", rating: 88, imageUrl: "https://via.placeholder.com/150" },
      { name: "Christopher Nkunku", position: "CAM", club: "RB Leipzig", rating: 86, imageUrl: "https://via.placeholder.com/150" },
      { name: "Kylian Mbappé", position: "LW", club: "PSG", rating: 91, imageUrl: "https://via.placeholder.com/150" },
      { name: "Kingsley Coman", position: "LW", club: "Bayern Munich", rating: 85, imageUrl: "https://via.placeholder.com/150" },
      { name: "Ousmane Dembélé", position: "RW", club: "Barcelona", rating: 85, imageUrl: "https://via.placeholder.com/150" },
      { name: "Moussa Diaby", position: "RW", club: "Bayer Leverkusen", rating: 82, imageUrl: "https://via.placeholder.com/150" },
      { name: "Karim Benzema", position: "ST", club: "Real Madrid", rating: 89, imageUrl: "https://via.placeholder.com/150" },
      { name: "Olivier Giroud", position: "ST", club: "AC Milan", rating: 82, imageUrl: "https://via.placeholder.com/150" },
      { name: "Marcus Thuram", position: "ST", club: "Borussia Mönchengladbach", rating: 81, imageUrl: "https://via.placeholder.com/150" },
    ];
    
    frenchPlayers.forEach(player => {
      const id = this.playerCurrentId++;
      this.players.set(id, { ...player, id });
    });
  }

  // Player operations
  async getAllPlayers(): Promise<Player[]> {
    return Array.from(this.players.values());
  }

  async getPlayersByPosition(position: string): Promise<Player[]> {
    return Array.from(this.players.values()).filter(
      player => player.position === position
    );
  }

  async getPlayerById(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }

  // Team operations
  async getAllTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }

  async getTeamById(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const id = this.teamCurrentId++;
    const newTeam: Team = { ...team, id };
    this.teams.set(id, newTeam);
    return newTeam;
  }

  async updateTeam(id: number, teamUpdate: Partial<InsertTeam>): Promise<Team | undefined> {
    const team = this.teams.get(id);
    if (!team) return undefined;
    
    const updatedTeam = { ...team, ...teamUpdate };
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }

  async deleteTeam(id: number): Promise<boolean> {
    return this.teams.delete(id);
  }
}

export const storage = new MemStorage();

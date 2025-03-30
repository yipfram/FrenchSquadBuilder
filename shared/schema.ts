import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Player schema
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(), // GK, CB, LB, RB, CDM, CM, CAM, LW, RW, ST
  club: text("club").notNull(),
  rating: integer("rating").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
});

// Team schema
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  formation: text("formation").notNull(), // 433, 442, 352, etc.
  players: jsonb("players").notNull(), // Array of player IDs with their positions
  powerScore: integer("power_score").notNull(),
  notes: text("notes").default(""),
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
});

export const formationSchema = z.object({
  name: z.string(),
  positions: z.array(
    z.object({
      id: z.string(),
      position: z.string(),
      left: z.string(),
      top: z.string(),
    })
  ),
});

export const playerPositionSchema = z.object({
  positionId: z.string(),
  playerId: z.number().optional(),
});

export type Formation = z.infer<typeof formationSchema>;
export type PlayerPosition = z.infer<typeof playerPositionSchema>;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

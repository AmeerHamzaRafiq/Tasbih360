import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasbihs = pgTable("tasbihs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  count: integer("count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTasbihSchema = createInsertSchema(tasbihs).pick({
  title: true,
  count: true,
});

export type InsertTasbih = z.infer<typeof insertTasbihSchema>;
export type Tasbih = typeof tasbihs.$inferSelect;
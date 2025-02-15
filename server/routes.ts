import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPrayerSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/prayers/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const prayers = await storage.getPrayersByUserId(userId);
    res.json(prayers);
  });

  app.post("/api/prayers", async (req, res) => {
    const result = insertPrayerSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    const prayer = await storage.createPrayer(result.data);
    res.json(prayer);
  });

  const httpServer = createServer(app);
  return httpServer;
}

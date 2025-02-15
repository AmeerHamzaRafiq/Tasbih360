import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTasbihSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.get("/api/tasbihs", async (_req, res) => {
    const tasbihs = await storage.getTasbihs();
    res.json(tasbihs);
  });

  app.post("/api/tasbihs", async (req, res) => {
    const result = insertTasbihSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    const tasbih = await storage.createTasbih(result.data);
    res.json(tasbih);
  });

  app.post("/api/tasbihs/:id/complete", async (req, res) => {
    const id = parseInt(req.params.id);
    const { count } = req.body;

    const tasbih = await storage.completeTasbih(id, count);
    if (!tasbih) {
      res.status(404).json({ error: "Tasbih not found" });
      return;
    }

    res.json(tasbih);
  });

  const httpServer = createServer(app);
  return httpServer;
}
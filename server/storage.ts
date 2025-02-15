import { tasbihs, type Tasbih, type InsertTasbih } from "@shared/schema";

export interface IStorage {
  createTasbih(tasbih: InsertTasbih): Promise<Tasbih>;
  getTasbihs(): Promise<Tasbih[]>;
  completeTasbih(id: number, count: number): Promise<Tasbih | undefined>;
}

export class MemStorage implements IStorage {
  private tasbihs: Map<number, Tasbih>;
  private currentTasbihId: number;

  constructor() {
    this.tasbihs = new Map();
    this.currentTasbihId = 1;
  }

  async createTasbih(insertTasbih: InsertTasbih): Promise<Tasbih> {
    const id = this.currentTasbihId++;
    const tasbih: Tasbih = {
      ...insertTasbih,
      id,
      createdAt: new Date(),
    };
    this.tasbihs.set(id, tasbih);
    return tasbih;
  }

  async getTasbihs(): Promise<Tasbih[]> {
    return Array.from(this.tasbihs.values());
  }

  async completeTasbih(id: number, count: number): Promise<Tasbih | undefined> {
    const tasbih = this.tasbihs.get(id);
    if (!tasbih) return undefined;

    const completedTasbih: Tasbih = {
      ...tasbih,
      count,
      createdAt: new Date(),
    };
    this.tasbihs.set(id, completedTasbih);
    return completedTasbih;
  }
}

export const storage = new MemStorage();
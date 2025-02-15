import { users, prayers, type User, type InsertUser, type Prayer, type InsertPrayer } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPrayer(prayer: InsertPrayer): Promise<Prayer>;
  getPrayersByUserId(userId: number): Promise<Prayer[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private prayers: Map<number, Prayer>;
  private currentUserId: number;
  private currentPrayerId: number;

  constructor() {
    this.users = new Map();
    this.prayers = new Map();
    this.currentUserId = 1;
    this.currentPrayerId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPrayer(insertPrayer: InsertPrayer): Promise<Prayer> {
    const id = this.currentPrayerId++;
    const prayer: Prayer = {
      ...insertPrayer,
      id,
      createdAt: new Date(),
    };
    this.prayers.set(id, prayer);
    return prayer;
  }

  async getPrayersByUserId(userId: number): Promise<Prayer[]> {
    return Array.from(this.prayers.values()).filter(
      (prayer) => prayer.userId === userId
    );
  }
}

export const storage = new MemStorage();

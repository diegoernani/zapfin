import { db } from "./db";
import {
  expenses,
  userStates,
  type InsertExpense,
  type InsertUserState,
  type Expense,
  type UserState
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Expenses
  createExpense(expense: InsertExpense): Promise<Expense>;
  getExpenses(filters?: { groupId?: string; userId?: string; category?: string }): Promise<Expense[]>;
  getExpensesByGroupAndUser(groupId: string, userId: string): Promise<Expense[]>;
  
  // User State
  getUserState(groupId: string, userId: string): Promise<UserState | undefined>;
  setUserState(state: InsertUserState): Promise<UserState>;
  clearUserState(groupId: string, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // === Expenses ===
  async createExpense(expense: InsertExpense): Promise<Expense> {
    const [newExpense] = await db.insert(expenses).values(expense).returning();
    return newExpense;
  }

  async getExpenses(filters?: { groupId?: string; userId?: string; category?: string }): Promise<Expense[]> {
    let query = db.select().from(expenses).orderBy(desc(expenses.createdAt));
    
    const conditions = [];
    if (filters?.groupId) conditions.push(eq(expenses.groupId, filters.groupId));
    if (filters?.userId) conditions.push(eq(expenses.userId, filters.userId));
    if (filters?.category) conditions.push(eq(expenses.category, filters.category));

    if (conditions.length > 0) {
      // @ts-ignore - weird type issue with spread and and()
      query = query.where(and(...conditions));
    }

    return await query;
  }

  async getExpensesByGroupAndUser(groupId: string, userId: string): Promise<Expense[]> {
    return await db.select()
      .from(expenses)
      .where(and(eq(expenses.groupId, groupId), eq(expenses.userId, userId)))
      .orderBy(desc(expenses.createdAt));
  }

  // === User States ===
  async getUserState(groupId: string, userId: string): Promise<UserState | undefined> {
    const [state] = await db.select()
      .from(userStates)
      .where(and(eq(userStates.groupId, groupId), eq(userStates.userId, userId)));
    return state;
  }

  async setUserState(state: InsertUserState): Promise<UserState> {
    const existing = await this.getUserState(state.groupId, state.userId);
    
    if (existing) {
      const [updated] = await db.update(userStates)
        .set({ 
          currentCategory: state.currentCategory, 
          lastInteraction: new Date() 
        })
        .where(eq(userStates.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(userStates).values(state).returning();
      return created;
    }
  }

  async clearUserState(groupId: string, userId: string): Promise<void> {
    await db.update(userStates)
      .set({ currentCategory: null, lastInteraction: new Date() })
      .where(and(eq(userStates.groupId, groupId), eq(userStates.userId, userId)));
  }
}

export const storage = new DatabaseStorage();

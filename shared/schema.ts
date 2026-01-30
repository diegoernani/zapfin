import { pgTable, text, serial, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Stores the expenses recorded via WhatsApp
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  groupId: text("group_id").notNull(),
  userId: text("user_id").notNull(),
  category: text("category").notNull(), // e.g., 'transporte', 'comida'
  amount: numeric("amount").notNull(), // Stored as string in numeric type
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Stores the current state of a user in a group (e.g., waiting for an image for a specific category)
export const userStates = pgTable("user_states", {
  id: serial("id").primaryKey(),
  groupId: text("group_id").notNull(),
  userId: text("user_id").notNull(),
  currentCategory: text("current_category"), // The category waiting for an image
  lastInteraction: timestamp("last_interaction").defaultNow(),
});

// === SCHEMAS ===

export const insertExpenseSchema = createInsertSchema(expenses).omit({ 
  id: true, 
  createdAt: true 
});

export const insertUserStateSchema = createInsertSchema(userStates).omit({ 
  id: true, 
  lastInteraction: true 
});

// === TYPES ===

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;

export type UserState = typeof userStates.$inferSelect;
export type InsertUserState = z.infer<typeof insertUserStateSchema>;

// === API SPECIFIC TYPES ===

// Webhook payload from Evolution API (Flexible for real use)
export const webhookPayloadSchema = z.any();

export type WebhookPayload = z.infer<typeof webhookPayloadSchema>;

export interface WebhookResponse {
  success: boolean;
  response: string; // The message to reply to the user
}

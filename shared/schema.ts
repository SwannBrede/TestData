import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const salesData = pgTable("sales_data", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  totalSales: decimal("total_sales", { precision: 12, scale: 2 }).notNull(),
  numberOfOrders: integer("number_of_orders").notNull(),
  avgOrderValue: decimal("avg_order_value", { precision: 10, scale: 2 }).notNull(),
  grossMargin: decimal("gross_margin", { precision: 5, scale: 2 }).notNull(),
  newCustomers: integer("new_customers").notNull(),
  customerRetentionRate: decimal("customer_retention_rate", { precision: 5, scale: 2 }),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSalesDataSchema = createInsertSchema(salesData).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSalesData = z.infer<typeof insertSalesDataSchema>;
export type SalesData = typeof salesData.$inferSelect;

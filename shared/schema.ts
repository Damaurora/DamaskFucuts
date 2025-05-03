import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("admin").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  news: many(news),
}));

export const insertUserSchema = createInsertSchema(users, {
  username: (schema) => schema.min(3, "Имя пользователя должно содержать не менее 3 символов"),
  password: (schema) => schema.min(6, "Пароль должен содержать не менее 6 символов"),
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products)
}));

export const insertCategorySchema = createInsertSchema(categories, {
  name: (schema) => schema.min(2, "Название должно содержать не менее 2 символов"),
  slug: (schema) => schema.min(2, "Slug должен содержать не менее 2 символов").regex(/^[a-z0-9-]+$/, "Slug может содержать только строчные буквы, цифры и дефисы"),
});
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Stores table
export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  weekdayHours: text("weekday_hours").notNull(),
  weekendHours: text("weekend_hours").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const storesRelations = relations(stores, ({ many }) => ({
  productAvailability: many(productAvailability)
}));

export const insertStoreSchema = createInsertSchema(stores, {
  name: (schema) => schema.min(2, "Название должно содержать не менее 2 символов"),
  address: (schema) => schema.min(5, "Адрес должен содержать не менее 5 символов"),
  phone: (schema) => schema.min(5, "Телефон должен содержать не менее 5 символов"),
});
export type InsertStore = z.infer<typeof insertStoreSchema>;
export type Store = typeof stores.$inferSelect;

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  imageUrl: text("image_url").notNull(),
  specifications: jsonb("specifications").notNull().$type<Array<{ name: string; value: string }>>(),
  tags: jsonb("tags").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  creator: one(users, { fields: [products.createdBy], references: [users.id] }),
  availability: many(productAvailability)
}));

export const insertProductSchema = createInsertSchema(products, {
  name: (schema) => schema.min(2, "Название должно содержать не менее 2 символов"),
  description: (schema) => schema.min(10, "Описание должно содержать не менее 10 символов"),
  imageUrl: (schema) => schema.min(5, "URL изображения должен быть валидным"),
});
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect & {
  categoryName?: string;
  categorySlug?: string;
  availability?: Array<{
    storeId: number;
    storeName: string;
    isAvailable: boolean;
  }>;
  specifications: Array<{ name: string; value: string }>;
  tags: string[];
};

// Product Availability table
export const productAvailability = pgTable("product_availability", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  storeId: integer("store_id").references(() => stores.id).notNull(),
  isAvailable: boolean("is_available").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productAvailabilityRelations = relations(productAvailability, ({ one }) => ({
  product: one(products, { fields: [productAvailability.productId], references: [products.id] }),
  store: one(stores, { fields: [productAvailability.storeId], references: [stores.id] })
}));

export const insertProductAvailabilitySchema = createInsertSchema(productAvailability);
export type InsertProductAvailability = z.infer<typeof insertProductAvailabilitySchema>;
export type ProductAvailability = typeof productAvailability.$inferSelect;

// News table
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  type: text("type").notNull().$type<"news" | "promotion" | "event">(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  publishDate: timestamp("publish_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id),
});

export const newsRelations = relations(news, ({ one }) => ({
  creator: one(users, { fields: [news.createdBy], references: [users.id] })
}));

export const insertNewsSchema = createInsertSchema(news, {
  title: (schema) => schema.min(3, "Заголовок должен содержать не менее 3 символов"),
  description: (schema) => schema.min(10, "Описание должно содержать не менее 10 символов"),
  content: (schema) => schema.min(20, "Контент должен содержать не менее 20 символов"),
  type: (schema) => schema.refine(val => ["news", "promotion", "event"].includes(val), "Тип должен быть news, promotion или event"),
});
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;

import { db } from "@db";
import { users, categories, products, stores, news, productAvailability, User, Category, Product, Store, News, ProductAvailability } from "@shared/schema";
import { eq, and, like, desc, sql, count } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "@db";

const PostgresSessionStore = connectPg(session);

// Define the storage interface
export interface IStorage {
  // User related methods
  getUser: (id: number) => Promise<User | undefined>;
  getUserByUsername: (username: string) => Promise<User | undefined>;
  createUser: (user: { username: string; password: string }) => Promise<User>;
  
  // Category related methods
  getCategories: () => Promise<Category[]>;
  getCategoryById: (id: number) => Promise<Category | undefined>;
  getCategoryBySlug: (slug: string) => Promise<Category | undefined>;
  createCategory: (category: { name: string; slug: string; description?: string }) => Promise<Category>;
  updateCategory: (id: number, category: { name?: string; slug?: string; description?: string }) => Promise<Category | undefined>;
  deleteCategory: (id: number) => Promise<boolean>;
  
  // Product related methods
  getProducts: (options?: { 
    search?: string;
    categoryId?: number;
    inStock?: boolean;
    storeId?: number[];
    tags?: string[];
    page?: number;
    pageSize?: number;
    sortBy?: string;
  }) => Promise<{ products: Product[]; totalProducts: number; totalPages: number }>;
  getProductById: (id: number) => Promise<Product | undefined>;
  getProductBySlug: (slug: string) => Promise<Product | undefined>;
  createProduct: (product: {
    name: string;
    slug: string;
    description: string;
    categoryId: number;
    imageUrl: string;
    specifications: Array<{ name: string; value: string }>;
    tags: string[];
    createdBy?: number;
  }) => Promise<Product>;
  updateProduct: (id: number, product: {
    name?: string;
    slug?: string;
    description?: string;
    categoryId?: number;
    imageUrl?: string;
    specifications?: Array<{ name: string; value: string }>;
    tags?: string[];
  }) => Promise<Product | undefined>;
  deleteProduct: (id: number) => Promise<boolean>;
  
  // Store related methods
  getStores: () => Promise<Store[]>;
  getStoreById: (id: number) => Promise<Store | undefined>;
  createStore: (store: {
    name: string;
    address: string;
    weekdayHours: string;
    weekendHours: string;
    phone: string;
  }) => Promise<Store>;
  updateStore: (id: number, store: {
    name?: string;
    address?: string;
    weekdayHours?: string;
    weekendHours?: string;
    phone?: string;
  }) => Promise<Store | undefined>;
  deleteStore: (id: number) => Promise<boolean>;
  
  // News related methods
  getNews: (options?: {
    type?: string;
    featured?: boolean;
    page?: number;
    pageSize?: number;
  }) => Promise<{ news: News[]; totalNews: number; totalPages: number }>;
  getNewsById: (id: number) => Promise<News | undefined>;
  createNews: (newsItem: {
    title: string;
    description: string;
    content: string;
    imageUrl: string;
    type: "news" | "promotion" | "event";
    isFeatured?: boolean;
    publishDate?: Date;
    createdBy?: number;
  }) => Promise<News>;
  updateNews: (id: number, newsItem: {
    title?: string;
    description?: string;
    content?: string;
    imageUrl?: string;
    type?: "news" | "promotion" | "event";
    isFeatured?: boolean;
    publishDate?: Date;
  }) => Promise<News | undefined>;
  deleteNews: (id: number) => Promise<boolean>;
  
  // Product Availability methods
  getProductAvailability: (productId: number) => Promise<ProductAvailability[]>;
  updateProductAvailability: (productId: number, storeId: number, isAvailable: boolean) => Promise<ProductAvailability>;
  
  // Admin stats
  getAdminStats: () => Promise<{
    productsCount: number;
    categoriesCount: number;
    newsCount: number;
    storesCount: number;
  }>;
  
  // Session store
  sessionStore: session.Store;
}

// Implement the DatabaseStorage class
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      tableName: 'sessions',
      createTableIfMissing: true
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  
  async createUser(user: { username: string; password: string }): Promise<User> {
    const [result] = await db.insert(users).values(user).returning();
    return result;
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.slug, slug));
    return result[0];
  }
  
  async createCategory(category: { name: string; slug: string; description?: string }): Promise<Category> {
    const [result] = await db.insert(categories).values(category).returning();
    return result;
  }
  
  async updateCategory(id: number, category: { name?: string; slug?: string; description?: string }): Promise<Category | undefined> {
    const [result] = await db.update(categories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return result;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    try {
      await db.delete(categories).where(eq(categories.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Product methods
  async getProducts(options: {
    search?: string;
    categoryId?: number;
    inStock?: boolean;
    storeId?: number[];
    tags?: string[];
    page?: number;
    pageSize?: number;
    sortBy?: string;
  } = {}): Promise<{ products: Product[]; totalProducts: number; totalPages: number }> {
    const {
      search = '',
      categoryId,
      inStock,
      storeId = [],
      tags = [],
      page = 1,
      pageSize = 9,
      sortBy = 'newest',
    } = options;
    
    let query = db.select({
      ...products,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id));
    
    // Apply filters
    if (search) {
      query = query.where(like(products.name, `%${search}%`));
    }
    
    if (categoryId) {
      query = query.where(eq(products.categoryId, categoryId));
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        query = query.orderBy(desc(products.createdAt));
        break;
      case 'popular':
        // Assuming popularity could be implemented in the future
        query = query.orderBy(desc(products.createdAt));
        break;
      case 'availability':
        // This would depend on product availability, simplified here
        query = query.orderBy(products.name);
        break;
      default:
        query = query.orderBy(desc(products.createdAt));
    }
    
    // Get total count for pagination
    const countResult = await db.select({ count: count() }).from(products);
    const totalProducts = Number(countResult[0].count);
    const totalPages = Math.ceil(totalProducts / pageSize);
    
    // Apply pagination
    query = query.limit(pageSize).offset((page - 1) * pageSize);
    
    // Execute query
    const productsResult = await query;
    
    // Get availability for these products
    const productIds = productsResult.map(p => p.id);
    
    if (productIds.length === 0) {
      return { products: [], totalProducts: 0, totalPages: 0 };
    }
    
    const availabilityData = await db.select({
      productId: productAvailability.productId,
      storeId: productAvailability.storeId,
      isAvailable: productAvailability.isAvailable,
      storeName: stores.name,
    })
    .from(productAvailability)
    .leftJoin(stores, eq(productAvailability.storeId, stores.id))
    .where(sql`${productAvailability.productId} IN (${productIds.join(',')})`)
    .orderBy(productAvailability.storeId);
    
    // Group availability by product
    const availabilityByProduct: Record<number, Array<{
      storeId: number;
      storeName: string;
      isAvailable: boolean;
    }>> = {};
    
    for (const item of availabilityData) {
      if (!availabilityByProduct[item.productId]) {
        availabilityByProduct[item.productId] = [];
      }
      
      availabilityByProduct[item.productId].push({
        storeId: item.storeId,
        storeName: item.storeName || '',
        isAvailable: item.isAvailable,
      });
    }
    
    // Filter by store and availability if needed
    let products = productsResult.map(product => ({
      ...product,
      availability: availabilityByProduct[product.id] || [],
    }));
    
    // Apply store filter if specified
    if (storeId.length > 0) {
      products = products.filter(product => 
        product.availability.some(a => storeId.includes(a.storeId))
      );
    }
    
    // Apply in-stock filter if specified
    if (inStock) {
      products = products.filter(product => 
        product.availability.some(a => a.isAvailable)
      );
    }
    
    // Apply tags filter if specified
    if (tags.length > 0) {
      products = products.filter(product => 
        tags.some(tag => product.tags.includes(tag))
      );
    }
    
    return {
      products,
      totalProducts,
      totalPages,
    };
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select({
      ...products,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id));
    
    if (!product) return undefined;
    
    // Get availability
    const availability = await db.select({
      storeId: productAvailability.storeId,
      isAvailable: productAvailability.isAvailable,
      storeName: stores.name,
    })
    .from(productAvailability)
    .leftJoin(stores, eq(productAvailability.storeId, stores.id))
    .where(eq(productAvailability.productId, id));
    
    return {
      ...product,
      availability: availability.map(a => ({
        storeId: a.storeId,
        storeName: a.storeName || '',
        isAvailable: a.isAvailable,
      })),
    };
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select({
      ...products,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug));
    
    if (!product) return undefined;
    
    // Get availability
    const availability = await db.select({
      storeId: productAvailability.storeId,
      isAvailable: productAvailability.isAvailable,
      storeName: stores.name,
    })
    .from(productAvailability)
    .leftJoin(stores, eq(productAvailability.storeId, stores.id))
    .where(eq(productAvailability.productId, product.id));
    
    return {
      ...product,
      availability: availability.map(a => ({
        storeId: a.storeId,
        storeName: a.storeName || '',
        isAvailable: a.isAvailable,
      })),
    };
  }
  
  async createProduct(product: {
    name: string;
    slug: string;
    description: string;
    categoryId: number;
    imageUrl: string;
    specifications: Array<{ name: string; value: string }>;
    tags: string[];
    createdBy?: number;
  }): Promise<Product> {
    const [result] = await db.insert(products).values(product).returning();
    return result;
  }
  
  async updateProduct(id: number, product: {
    name?: string;
    slug?: string;
    description?: string;
    categoryId?: number;
    imageUrl?: string;
    specifications?: Array<{ name: string; value: string }>;
    tags?: string[];
  }): Promise<Product | undefined> {
    const [result] = await db.update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return result;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    try {
      // First delete availability records
      await db.delete(productAvailability).where(eq(productAvailability.productId, id));
      // Then delete product
      await db.delete(products).where(eq(products.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Store methods
  async getStores(): Promise<Store[]> {
    return await db.select().from(stores);
  }
  
  async getStoreById(id: number): Promise<Store | undefined> {
    const result = await db.select().from(stores).where(eq(stores.id, id));
    return result[0];
  }
  
  async createStore(store: {
    name: string;
    address: string;
    weekdayHours: string;
    weekendHours: string;
    phone: string;
  }): Promise<Store> {
    const [result] = await db.insert(stores).values(store).returning();
    return result;
  }
  
  async updateStore(id: number, store: {
    name?: string;
    address?: string;
    weekdayHours?: string;
    weekendHours?: string;
    phone?: string;
  }): Promise<Store | undefined> {
    const [result] = await db.update(stores)
      .set(store)
      .where(eq(stores.id, id))
      .returning();
    return result;
  }
  
  async deleteStore(id: number): Promise<boolean> {
    try {
      // First check if there are any availability records
      const avCount = await db.select({ count: count() })
        .from(productAvailability)
        .where(eq(productAvailability.storeId, id));
      
      if (Number(avCount[0].count) > 0) {
        // Delete availability records first
        await db.delete(productAvailability).where(eq(productAvailability.storeId, id));
      }
      
      // Then delete store
      await db.delete(stores).where(eq(stores.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // News methods
  async getNews(options: {
    type?: string;
    featured?: boolean;
    page?: number;
    pageSize?: number;
  } = {}): Promise<{ news: News[]; totalNews: number; totalPages: number }> {
    const {
      type,
      featured,
      page = 1,
      pageSize = 10,
    } = options;
    
    let query = db.select().from(news);
    
    // Apply filters
    if (type) {
      query = query.where(eq(news.type, type as any));
    }
    
    if (featured !== undefined) {
      query = query.where(eq(news.isFeatured, featured));
    }
    
    // Get total count for pagination
    const countResult = await db.select({ count: count() }).from(news);
    const totalNews = Number(countResult[0].count);
    const totalPages = Math.ceil(totalNews / pageSize);
    
    // Apply sorting and pagination
    query = query.orderBy(desc(news.publishDate))
      .limit(pageSize)
      .offset((page - 1) * pageSize);
    
    // Execute query
    const newsResult = await query;
    
    return {
      news: newsResult,
      totalNews,
      totalPages,
    };
  }
  
  async getNewsById(id: number): Promise<News | undefined> {
    const result = await db.select().from(news).where(eq(news.id, id));
    return result[0];
  }
  
  async createNews(newsItem: {
    title: string;
    description: string;
    content: string;
    imageUrl: string;
    type: "news" | "promotion" | "event";
    isFeatured?: boolean;
    publishDate?: Date;
    createdBy?: number;
  }): Promise<News> {
    const [result] = await db.insert(news).values(newsItem).returning();
    return result;
  }
  
  async updateNews(id: number, newsItem: {
    title?: string;
    description?: string;
    content?: string;
    imageUrl?: string;
    type?: "news" | "promotion" | "event";
    isFeatured?: boolean;
    publishDate?: Date;
  }): Promise<News | undefined> {
    const [result] = await db.update(news)
      .set({ ...newsItem, updatedAt: new Date() })
      .where(eq(news.id, id))
      .returning();
    return result;
  }
  
  async deleteNews(id: number): Promise<boolean> {
    try {
      await db.delete(news).where(eq(news.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Product Availability methods
  async getProductAvailability(productId: number): Promise<ProductAvailability[]> {
    return await db.select()
      .from(productAvailability)
      .where(eq(productAvailability.productId, productId));
  }
  
  async updateProductAvailability(productId: number, storeId: number, isAvailable: boolean): Promise<ProductAvailability> {
    // Check if record exists
    const existing = await db.select()
      .from(productAvailability)
      .where(and(
        eq(productAvailability.productId, productId),
        eq(productAvailability.storeId, storeId)
      ));
    
    if (existing.length > 0) {
      // Update existing record
      const [result] = await db.update(productAvailability)
        .set({ isAvailable, updatedAt: new Date() })
        .where(and(
          eq(productAvailability.productId, productId),
          eq(productAvailability.storeId, storeId)
        ))
        .returning();
      return result;
    } else {
      // Create new record
      const [result] = await db.insert(productAvailability)
        .values({ productId, storeId, isAvailable })
        .returning();
      return result;
    }
  }
  
  // Admin stats
  async getAdminStats(): Promise<{
    productsCount: number;
    categoriesCount: number;
    newsCount: number;
    storesCount: number;
  }> {
    const [productsCount] = await db.select({ count: count() }).from(products);
    const [categoriesCount] = await db.select({ count: count() }).from(categories);
    const [newsCount] = await db.select({ count: count() }).from(news);
    const [storesCount] = await db.select({ count: count() }).from(stores);
    
    return {
      productsCount: Number(productsCount.count),
      categoriesCount: Number(categoriesCount.count),
      newsCount: Number(newsCount.count),
      storesCount: Number(storesCount.count),
    };
  }
}

// Export an instance of DatabaseStorage
export const storage = new DatabaseStorage();

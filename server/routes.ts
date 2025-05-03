import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertProductSchema, insertCategorySchema, insertNewsSchema, insertStoreSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // API prefix
  const apiPrefix = "/api";
  
  // GENERAL ROUTES (PUBLIC ACCESS)
  
  // Categories routes
  app.get(`${apiPrefix}/categories`, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Ошибка при получении категорий" });
    }
  });
  
  app.get(`${apiPrefix}/categories/:slug`, async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Категория не найдена" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Ошибка при получении категории" });
    }
  });
  
  // Products routes
  app.get(`${apiPrefix}/products`, async (req, res) => {
    try {
      const { 
        search, 
        categoryId, 
        inStock, 
        storeId, 
        tag, 
        page, 
        pageSize, 
        sortBy 
      } = req.query;
      
      // Handle multiple storeId and tag values
      const storeIds = Array.isArray(storeId) 
        ? storeId.map(id => parseInt(id as string, 10)).filter(id => !isNaN(id))
        : storeId ? [parseInt(storeId as string, 10)].filter(id => !isNaN(id)) : [];
        
      const tags = Array.isArray(tag) ? tag as string[] : tag ? [tag as string] : [];
      
      const result = await storage.getProducts({
        search: search as string,
        categoryId: categoryId ? parseInt(categoryId as string, 10) : undefined,
        inStock: inStock === 'true',
        storeId: storeIds,
        tags,
        page: page ? parseInt(page as string, 10) : 1,
        pageSize: pageSize ? parseInt(pageSize as string, 10) : 9,
        sortBy: sortBy as string,
      });
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Ошибка при получении товаров" });
    }
  });
  
  app.get(`${apiPrefix}/products/:id`, async (req, res) => {
    try {
      const product = await storage.getProductById(parseInt(req.params.id, 10));
      if (!product) {
        return res.status(404).json({ message: "Товар не найден" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Ошибка при получении товара" });
    }
  });
  
  // Stores routes
  app.get(`${apiPrefix}/stores`, async (req, res) => {
    try {
      const stores = await storage.getStores();
      res.json(stores);
    } catch (error) {
      console.error("Error fetching stores:", error);
      res.status(500).json({ message: "Ошибка при получении магазинов" });
    }
  });
  
  app.get(`${apiPrefix}/stores/:id`, async (req, res) => {
    try {
      const store = await storage.getStoreById(parseInt(req.params.id, 10));
      if (!store) {
        return res.status(404).json({ message: "Магазин не найден" });
      }
      res.json(store);
    } catch (error) {
      console.error("Error fetching store:", error);
      res.status(500).json({ message: "Ошибка при получении магазина" });
    }
  });
  
  // News routes
  app.get(`${apiPrefix}/news`, async (req, res) => {
    try {
      const { type, featured, page, pageSize } = req.query;
      
      const result = await storage.getNews({
        type: type as string,
        featured: featured === 'true',
        page: page ? parseInt(page as string, 10) : 1,
        pageSize: pageSize ? parseInt(pageSize as string, 10) : 10,
      });
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Ошибка при получении новостей" });
    }
  });
  
  app.get(`${apiPrefix}/news/:id`, async (req, res) => {
    try {
      const newsItem = await storage.getNewsById(parseInt(req.params.id, 10));
      if (!newsItem) {
        return res.status(404).json({ message: "Новость не найдена" });
      }
      res.json(newsItem);
    } catch (error) {
      console.error("Error fetching news item:", error);
      res.status(500).json({ message: "Ошибка при получении новости" });
    }
  });
  
  // ADMIN ROUTES (PROTECTED)
  
  // Check if user is authenticated middleware
  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };
  
  // Admin stats
  app.get(`${apiPrefix}/admin/stats`, isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Ошибка при получении статистики" });
    }
  });
  
  // Admin products
  app.get(`${apiPrefix}/admin/products`, isAuthenticated, async (req, res) => {
    try {
      const { 
        search, 
        categoryId, 
        inStock, 
        storeId, 
        tag, 
        page, 
        pageSize, 
        sortBy 
      } = req.query;
      
      // Handle multiple storeId and tag values
      const storeIds = Array.isArray(storeId) 
        ? storeId.map(id => parseInt(id as string, 10)).filter(id => !isNaN(id))
        : storeId ? [parseInt(storeId as string, 10)].filter(id => !isNaN(id)) : [];
        
      const tags = Array.isArray(tag) ? tag as string[] : tag ? [tag as string] : [];
      
      const result = await storage.getProducts({
        search: search as string,
        categoryId: categoryId ? parseInt(categoryId as string, 10) : undefined,
        inStock: inStock === 'true',
        storeId: storeIds,
        tags,
        page: page ? parseInt(page as string, 10) : 1,
        pageSize: pageSize ? parseInt(pageSize as string, 10) : 10, // Larger page size for admin
        sortBy: sortBy as string,
      });
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching admin products:", error);
      res.status(500).json({ message: "Ошибка при получении товаров" });
    }
  });
  
  app.post(`${apiPrefix}/admin/products`, isAuthenticated, async (req, res) => {
    try {
      // Validate request body
      const data = insertProductSchema.parse(req.body);
      
      // Create slug from name if not provided
      if (!data.slug) {
        data.slug = data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      
      // Create product
      const product = await storage.createProduct({
        ...data,
        createdBy: req.user?.id,
      });
      
      // Update availability for all stores
      if (req.body.availability && Array.isArray(req.body.availability)) {
        const stores = await storage.getStores();
        for (const store of stores) {
          const availItem = req.body.availability.find(a => a.storeId === store.id);
          if (availItem) {
            await storage.updateProductAvailability(
              product.id,
              store.id,
              availItem.isAvailable
            );
          }
        }
      }
      
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Ошибка при создании товара" });
    }
  });
  
  app.patch(`${apiPrefix}/admin/products/:id`, isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      // Check if product exists
      const existingProduct = await storage.getProductById(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Товар не найден" });
      }
      
      // Update product
      const product = await storage.updateProduct(id, req.body);
      
      // Update availability if provided
      if (req.body.availability && Array.isArray(req.body.availability)) {
        for (const availItem of req.body.availability) {
          await storage.updateProductAvailability(
            id,
            availItem.storeId,
            availItem.isAvailable
          );
        }
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Ошибка при обновлении товара" });
    }
  });
  
  app.delete(`${apiPrefix}/admin/products/:id`, isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Товар не найден или не может быть удален" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Ошибка при удалении товара" });
    }
  });
  
  // Admin categories
  app.get(`${apiPrefix}/admin/categories`, isAuthenticated, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching admin categories:", error);
      res.status(500).json({ message: "Ошибка при получении категорий" });
    }
  });
  
  app.post(`${apiPrefix}/admin/categories`, isAuthenticated, async (req, res) => {
    try {
      // Validate request body
      const data = insertCategorySchema.parse(req.body);
      
      // Create category
      const category = await storage.createCategory(data);
      
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Ошибка при создании категории" });
    }
  });
  
  app.patch(`${apiPrefix}/admin/categories/:id`, isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      // Check if category exists
      const existingCategory = await storage.getCategoryById(id);
      if (!existingCategory) {
        return res.status(404).json({ message: "Категория не найдена" });
      }
      
      // Update category
      const category = await storage.updateCategory(id, req.body);
      
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Ошибка при обновлении категории" });
    }
  });
  
  app.delete(`${apiPrefix}/admin/categories/:id`, isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await storage.deleteCategory(id);
      
      if (!success) {
        return res.status(404).json({ message: "Категория не найдена или не может быть удалена" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Ошибка при удалении категории" });
    }
  });
  
  // Admin news
  app.get(`${apiPrefix}/admin/news`, isAuthenticated, async (req, res) => {
    try {
      const { type, featured, page, pageSize } = req.query;
      
      const result = await storage.getNews({
        type: type as string,
        featured: featured === 'true',
        page: page ? parseInt(page as string, 10) : 1,
        pageSize: pageSize ? parseInt(pageSize as string, 10) : 10,
      });
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching admin news:", error);
      res.status(500).json({ message: "Ошибка при получении новостей" });
    }
  });
  
  app.post(`${apiPrefix}/admin/news`, isAuthenticated, async (req, res) => {
    try {
      // Validate request body
      const data = insertNewsSchema.parse(req.body);
      
      // Create news
      const newsItem = await storage.createNews({
        ...data,
        createdBy: req.user?.id,
      });
      
      res.status(201).json(newsItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating news item:", error);
      res.status(500).json({ message: "Ошибка при создании новости" });
    }
  });
  
  app.patch(`${apiPrefix}/admin/news/:id`, isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      // Check if news exists
      const existingNews = await storage.getNewsById(id);
      if (!existingNews) {
        return res.status(404).json({ message: "Новость не найдена" });
      }
      
      // Update news
      const newsItem = await storage.updateNews(id, req.body);
      
      res.json(newsItem);
    } catch (error) {
      console.error("Error updating news item:", error);
      res.status(500).json({ message: "Ошибка при обновлении новости" });
    }
  });
  
  app.delete(`${apiPrefix}/admin/news/:id`, isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await storage.deleteNews(id);
      
      if (!success) {
        return res.status(404).json({ message: "Новость не найдена или не может быть удалена" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting news item:", error);
      res.status(500).json({ message: "Ошибка при удалении новости" });
    }
  });
  
  // Admin stores
  app.get(`${apiPrefix}/admin/stores`, isAuthenticated, async (req, res) => {
    try {
      const stores = await storage.getStores();
      res.json(stores);
    } catch (error) {
      console.error("Error fetching admin stores:", error);
      res.status(500).json({ message: "Ошибка при получении магазинов" });
    }
  });
  
  app.post(`${apiPrefix}/admin/stores`, isAuthenticated, async (req, res) => {
    try {
      // Validate request body
      const data = insertStoreSchema.parse(req.body);
      
      // Create store
      const store = await storage.createStore(data);
      
      res.status(201).json(store);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating store:", error);
      res.status(500).json({ message: "Ошибка при создании магазина" });
    }
  });
  
  app.patch(`${apiPrefix}/admin/stores/:id`, isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      // Check if store exists
      const existingStore = await storage.getStoreById(id);
      if (!existingStore) {
        return res.status(404).json({ message: "Магазин не найден" });
      }
      
      // Update store
      const store = await storage.updateStore(id, req.body);
      
      res.json(store);
    } catch (error) {
      console.error("Error updating store:", error);
      res.status(500).json({ message: "Ошибка при обновлении магазина" });
    }
  });
  
  app.delete(`${apiPrefix}/admin/stores/:id`, isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await storage.deleteStore(id);
      
      if (!success) {
        return res.status(404).json({ message: "Магазин не найден или не может быть удален" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting store:", error);
      res.status(500).json({ message: "Ошибка при удалении магазина" });
    }
  });
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}

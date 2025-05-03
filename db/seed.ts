import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  try {
    console.log("Starting seed process...");
    
    // Hash default admin password
    const hashedPassword = await hashPassword("admin123");
    
    // Check if admin user exists
    const existingAdmin = await db.select().from(schema.users).where(eq(schema.users.username, "admin"));
    
    if (existingAdmin.length === 0) {
      console.log("Creating admin user...");
      await db.insert(schema.users).values({
        username: "admin",
        password: hashedPassword,
        role: "admin",
      });
    } else {
      console.log("Admin user already exists");
    }
    
    // Check if stores exist
    const existingStores = await db.select().from(schema.stores);
    
    if (existingStores.length === 0) {
      console.log("Creating stores...");
      const storesData = [
        {
          name: "Damask Shop на Гагарина",
          address: "г. Самара, ул. Гагарина 32",
          weekdayHours: "Пн-Пт: 10:00 - 21:00",
          weekendHours: "Сб-Вс: 11:00 - 20:00",
          phone: "+7 (846) 123-45-67",
        },
        {
          name: "Damask Shop на Победе",
          address: "г. Самара, ул. Победы 7",
          weekdayHours: "Пн-Пт: 10:00 - 21:00",
          weekendHours: "Сб-Вс: 11:00 - 20:00",
          phone: "+7 (846) 123-45-68",
        },
      ];
      
      await db.insert(schema.stores).values(storesData);
    } else {
      console.log("Stores already exist");
    }
    
    // Check if categories exist
    const existingCategories = await db.select().from(schema.categories);
    
    if (existingCategories.length === 0) {
      console.log("Creating categories...");
      const categoriesData = [
        {
          name: "Поды",
          slug: "pods",
          description: "Компактные электронные устройства для вейпинга",
        },
        {
          name: "Под-моды",
          slug: "pod-mods",
          description: "Мощные устройства с расширенными возможностями настройки",
        },
        {
          name: "Одноразовые устройства",
          slug: "disposables",
          description: "Одноразовые электронные сигареты",
        },
        {
          name: "Жидкости",
          slug: "liquids",
          description: "Жидкости для заправки электронных сигарет",
        },
        {
          name: "Табак",
          slug: "tobacco",
          description: "Табак для кальянов",
        },
        {
          name: "Жевательный табак",
          slug: "chewing-tobacco",
          description: "Жевательный табак различных вкусов",
        },
        {
          name: "Кальяны",
          slug: "hookahs",
          description: "Кальяны и аксессуары для них",
        },
        {
          name: "Расходники",
          slug: "consumables",
          description: "Расходные материалы для электронных устройств",
        },
      ];
      
      await db.insert(schema.categories).values(categoriesData);
    } else {
      console.log("Categories already exist");
    }
    
    // Check if products exist
    const existingProducts = await db.select().from(schema.products);
    
    if (existingProducts.length === 0) {
      console.log("Creating products...");
      
      // Get the categories
      const categories = await db.select().from(schema.categories);
      const categoryMap = new Map(categories.map(c => [c.slug, c.id]));
      
      const productsData = [
        {
          name: "SMOK Nord 5",
          slug: "smok-nord-5",
          description: "Компактный под с мощностью до 40W и аккумулятором 2000mAh",
          categoryId: categoryMap.get("pods") || 1,
          imageUrl: "https://images.unsplash.com/photo-1606768666853-403c90a981ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          specifications: JSON.stringify([
            { name: "Мощность", value: "5-40W" },
            { name: "Ёмкость аккумулятора", value: "2000mAh" },
            { name: "Объем картриджа", value: "4.5ml" },
            { name: "Сопротивление", value: "0.4Ω / 0.8Ω" },
          ]),
          tags: JSON.stringify(["Новинка"]),
        },
        {
          name: "Жидкость Fruit Mix",
          slug: "liquid-fruit-mix",
          description: "Премиальная жидкость с фруктовым вкусом, 60мл, 3мг",
          categoryId: categoryMap.get("liquids") || 4,
          imageUrl: "https://images.unsplash.com/photo-1605348070238-5a0d5e2a87f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          specifications: JSON.stringify([
            { name: "Объем", value: "60ml" },
            { name: "Крепость", value: "3mg" },
            { name: "PG/VG", value: "30/70" },
            { name: "Вкус", value: "Фруктовый микс" },
          ]),
          tags: JSON.stringify(["Топ продаж"]),
        },
        {
          name: "Elf Bar BC5000",
          slug: "elf-bar-bc5000",
          description: "Одноразовая электронная сигарета на 5000 затяжек",
          categoryId: categoryMap.get("disposables") || 3,
          imageUrl: "https://images.unsplash.com/photo-1595784279873-62b38b5e7cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          specifications: JSON.stringify([
            { name: "Количество затяжек", value: "до 5000" },
            { name: "Ёмкость аккумулятора", value: "650mAh" },
            { name: "Объем жидкости", value: "13ml" },
            { name: "Никотин", value: "5%" },
          ]),
          tags: JSON.stringify([]),
        },
        {
          name: "Vaporesso Gen X",
          slug: "vaporesso-gen-x",
          description: "Мощный под-мод с регулировкой до 220W и сменным аккумулятором",
          categoryId: categoryMap.get("pod-mods") || 2,
          imageUrl: "https://images.unsplash.com/photo-1563253746-550b6cc3df83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          specifications: JSON.stringify([
            { name: "Мощность", value: "5-220W" },
            { name: "Аккумулятор", value: "2x 18650 (не входят в комплект)" },
            { name: "Режимы", value: "VW / VV / TC / PULSE / SMART" },
            { name: "Материал", value: "Цинковый сплав + PCTG" },
          ]),
          tags: JSON.stringify(["Рекомендуем"]),
        },
        {
          name: "Кальян Alpha Hookah X",
          slug: "alpha-hookah-x",
          description: "Премиальный кальян из нержавеющей стали с LED подсветкой",
          categoryId: categoryMap.get("hookahs") || 7,
          imageUrl: "https://images.unsplash.com/photo-1543238300-ac8927fc204b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          specifications: JSON.stringify([
            { name: "Высота", value: "62 см" },
            { name: "Материал", value: "Нержавеющая сталь" },
            { name: "Колба", value: "Стекло" },
            { name: "Подсветка", value: "LED RGB" },
          ]),
          tags: JSON.stringify([]),
        },
        {
          name: "Табак Darkside",
          slug: "tobacco-darkside",
          description: "Крепкий табак для кальяна со вкусом грейпфрута, 100г",
          categoryId: categoryMap.get("tobacco") || 5,
          imageUrl: "https://images.unsplash.com/photo-1560809451-4653df007ad9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          specifications: JSON.stringify([
            { name: "Вес", value: "100 г" },
            { name: "Крепость", value: "Средняя" },
            { name: "Вкус", value: "Грейпфрут" },
            { name: "Линейка", value: "CORE" },
          ]),
          tags: JSON.stringify([]),
        },
      ];
      
      for (const product of productsData) {
        const [newProduct] = await db.insert(schema.products).values(product).returning();
        
        // Add product availability
        const stores = await db.select().from(schema.stores);
        
        for (const store of stores) {
          // Randomly make some products unavailable in some stores
          const isAvailable = Math.random() > 0.3;
          
          await db.insert(schema.productAvailability).values({
            productId: newProduct.id,
            storeId: store.id,
            isAvailable,
          });
        }
      }
    } else {
      console.log("Products already exist");
    }
    
    // Check if news exist
    const existingNews = await db.select().from(schema.news);
    
    if (existingNews.length === 0) {
      console.log("Creating news items...");
      
      const newsData = [
        {
          title: "Новая коллекция подов 2025",
          description: "Встречайте революционные устройства с улучшенной автономностью и новым дизайном",
          content: `<p>Мы рады представить вам новую коллекцию подов 2025 года. Эти устройства разработаны с использованием последних технологий и предлагают непревзойденный опыт вейпинга.</p>
                    <p>Особенности новой коллекции:</p>
                    <ul>
                      <li>Улучшенная автономность работы аккумулятора</li>
                      <li>Новый эргономичный дизайн</li>
                      <li>Усовершенствованная система подачи жидкости</li>
                      <li>Расширенные настройки мощности</li>
                    </ul>
                    <p>Приходите в наши магазины, чтобы протестировать новинки уже сегодня!</p>`,
          imageUrl: "https://images.unsplash.com/photo-1563253746-550b6cc3df83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          type: "news",
          isFeatured: true,
        },
        {
          title: "Скидка 20% на все жидкости",
          description: "Только до конца месяца успейте приобрести премиальные жидкости со скидкой",
          content: `<p>Специальное предложение для всех любителей качественного вейпинга - скидка 20% на все жидкости в нашем каталоге!</p>
                    <p>Акция распространяется на все бренды и вкусы, включая популярные линейки:</p>
                    <ul>
                      <li>Fruit Mix</li>
                      <li>Dessert Collection</li>
                      <li>Tobacco Master</li>
                      <li>Premium Line</li>
                    </ul>
                    <p>Акция действует до конца месяца во всех магазинах сети Damask Shop.</p>
                    <p>Не упустите возможность пополнить свои запасы по выгодной цене!</p>`,
          imageUrl: "https://images.unsplash.com/photo-1560809451-b4084116f9a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          type: "promotion",
          isFeatured: true,
        },
        {
          title: "Дегустация новых вкусов",
          description: "Приглашаем на дегустацию новой линейки жидкостей этой субботу",
          content: `<p>Дорогие друзья! Мы рады пригласить вас на дегустацию новой линейки жидкостей, которая состоится в эту субботу в нашем магазине на ул. Гагарина 32.</p>
                    <p>В программе мероприятия:</p>
                    <ul>
                      <li>Презентация новых вкусов от ведущих производителей</li>
                      <li>Бесплатная дегустация жидкостей</li>
                      <li>Консультации от опытных вейперов</li>
                      <li>Специальные цены на представленные новинки</li>
                    </ul>
                    <p>Начало мероприятия в 15:00. Вход свободный.</p>
                    <p>Ждём всех любителей вейпинга!</p>`,
          imageUrl: "https://images.unsplash.com/photo-1560809049-8ddd3f8d4858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          type: "event",
          isFeatured: true,
        },
      ];
      
      await db.insert(schema.news).values(newsData);
    } else {
      console.log("News already exist");
    }
    
    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error during seed:", error);
  }
}

seed();

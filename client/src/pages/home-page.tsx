import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import Carousel from '@/components/home/carousel';
import ProductGrid from '@/components/products/product-grid';
import StoreCard from '@/components/home/store-card';
import { useQuery } from '@tanstack/react-query';
import { Store, Category } from '@shared/schema';

const HomePage = () => {
  const { data: stores } = useQuery<Store[]>({ 
    queryKey: ['/api/stores']
  });
  
  const { data: categories } = useQuery<Category[]>({ 
    queryKey: ['/api/categories']
  });
  
  return (
    <div>
      {/* News & Promotions Hero Carousel */}
      <section className="pt-8 pb-4 md:py-12 bg-gradient-to-b from-background to-card/30 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-unbounded text-xl md:text-3xl">Новости и акции</h2>
            <Link href="/news" className="text-sm text-primary hover:underline">Все новости</Link>
          </div>
          <Carousel />
          
          {/* Quick Call-to-Action */}
          <div className="mt-6 flex justify-center">
            <Link href="/catalog">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-medium">
                Смотреть каталог
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Categories Grid */}
      <section className="py-6 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-unbounded text-xl md:text-3xl">Категории</h2>
            <Link href="/catalog" className="text-sm text-primary hover:underline">Все категории</Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {/* Всегда показывать опцию "Все товары" */}
            <Link href="/catalog" className="category-tile flex flex-col overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="h-24 md:h-32 bg-gradient-to-br from-slate-500/10 to-slate-500/30 relative flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300" 
                  alt="Все товары" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              </div>
              <div className="p-2 bg-card h-10 flex items-center justify-center">
                <span className="text-sm font-medium text-center line-clamp-1">Все товары</span>
              </div>
            </Link>
            
            {/* Отсортированный вывод категорий в нужном порядке */}
            {(() => {
              if (!categories || categories.length === 0) return null;
              
              // Функция для определения цвета и изображения по слагу категории
              const getCategoryAssets = (slug: string) => {
                const assets: {[key: string]: {icon: JSX.Element, bg: string, imgUrl: string}} = {
                  // Предустановленные ассеты для известных категорий
                  'pods': {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M18.178 2.337a3 3 0 0 0-4.242 0l-8.48 8.482a6 6 0 0 0 8.485 8.485l8.486-8.485"></path><path d="M8.75 13.4 5.9 16.244a1 1 0 0 0 0 1.414l.342.342a1 1 0 0 0 1.414 0l2.83-2.83"></path></svg>,
                    bg: 'from-primary/10 to-primary/40',
                    imgUrl: 'https://images.unsplash.com/photo-1562576661-c92d55da39f5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300'
                  },
                  'pod-mods': {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M16.2 3.8a2.7 2.7 0 0 0-3.81 0l-.4.38A.91.91 0 0 0 13.5 5a1 1 0 0 1 .5.92v1.38a2.72 2.72 0 0 0 0 .38l5-4.93"></path><path d="M11.61 12.55a2.7 2.7 0 0 0-3.81 0l-.4.38a.91.91 0 0 0 1.5.83 1 1 0 0 1 .5.92v1.38a2.72 2.72 0 0 0 0 .38l5-4.93"></path><path d="m19 6-5 4.93V14"></path><path d="M19 10v7c0 .34-.22.64-.42.8L16 20"></path><path d="M7 14v3c0 .34-.22.64-.42.8L4 20"></path></svg>,
                    bg: 'from-rose-500/10 to-rose-500/40',
                    imgUrl: 'https://images.unsplash.com/photo-1569870499705-504209102861?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300'
                  },
                  'disposables': {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M6 2v20l12-10Z"></path></svg>,
                    bg: 'from-purple-500/10 to-purple-500/40',
                    imgUrl: 'https://images.unsplash.com/photo-1541418950054-c12804e149d9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300'
                  },
                  'liquids': {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M8.67 2h6.66c.67 0 1.34.34 1.34 1.34C16.67 4.67 15.67 6 14 6h-4c-1.67 0-2.67-1.33-2.67-2.66C7.33 2.34 8 2 8.67 2Z"></path><path d="M4 15c0-5 2-9 8-9s8 4 8 9v1c0 3-1 5-4 5h-8c-3 0-4-2-4-5v-1Z"></path><path d="M4 15h16"></path></svg>,
                    bg: 'from-blue-500/10 to-blue-500/40',
                    imgUrl: 'https://images.unsplash.com/photo-1558452919-d8a1c7d91d0f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300'
                  },
                  'tobacco': {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M2 20h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H2"></path><path d="M2 4h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2"></path><path d="M2 4v16"></path></svg>,
                    bg: 'from-amber-500/10 to-amber-500/40',
                    imgUrl: 'https://images.unsplash.com/photo-1519420573924-65fcd9954486?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300'
                  },
                  'chewing-tobacco': {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M3 2v1c0 1 2 1 2 2S3 6 3 7s2 1 2 2-2 1-2 2 2 1 2 2"></path><path d="M18 6h.01"></path><path d="M6 13v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2Z"></path><path d="M18 2c-.9.9-.9 2.1 0 3"></path><path d="M18 9c.9.9.9 2.1 0 3"></path><path d="M21 2c-1.2 1.2-1.2 2.8 0 4"></path><path d="m21 9-.08.09"></path><path d="M12 22v-5"></path><path d="M8 22v-3"></path><path d="M16 22v-3"></path></svg>,
                    bg: 'from-yellow-600/10 to-yellow-600/40',
                    imgUrl: 'https://images.unsplash.com/photo-1531926074729-ed7a0da9be0b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300'
                  },
                  'hookahs': {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M4 8h9a3 3 0 0 0 3-3 1 1 0 0 0-1-1h-3"></path><path d="M4 8h5a3 3 0 0 1 3 3 1 1 0 0 1-1 1h-3"></path><path d="M4 16h9a3 3 0 0 0 3-3 1 1 0 0 0-1-1h-3"></path><path d="M8 21l2 -14"></path></svg>,
                    bg: 'from-green-500/10 to-green-500/40',
                    imgUrl: 'https://images.unsplash.com/photo-1578670407805-f4682dbe74f9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300'
                  },
                  'accessories': {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M11 13v-2a3 3 0 1 1 0-6a14.5 14.5 0 0 0 4 0a3 3 0 1 1 0 6v2"></path><path d="M11 19v-6"></path><path d="M15 19v-6"></path><circle cx="13" cy="19" r="2"></circle></svg>,
                    bg: 'from-teal-500/10 to-teal-500/40',
                    imgUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300'
                  },
                  // Дефолтные ассеты, если категория не соответствует известным
                  'default': {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                    bg: 'from-indigo-500/10 to-indigo-500/40',
                    imgUrl: 'https://images.unsplash.com/photo-1607453998774-d533f65dac99?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300'
                  }
                };
                
                return assets[slug] || assets['default'];
              };
              
              // Желаемый порядок категорий
              const categoryOrder = [
                'pods', 
                'pod-mods', 
                'disposables', 
                'liquids', 
                'tobacco', 
                'chewing-tobacco', 
                'hookahs', 
                'accessories'
              ];
              
              // Создаем карту для быстрого поиска категорий по slug
              const categoryMap = categories.reduce((acc, category) => {
                acc[category.slug] = category;
                return acc;
              }, {} as Record<string, typeof categories[0]>);
              
              // Создаем отсортированный массив категорий
              const sortedCategories = categoryOrder
                .filter(slug => categoryMap[slug]) // Отфильтровываем слаги, которых нет в базе
                .map(slug => categoryMap[slug]);
              
              // Добавляем категории, которые не были включены в предустановленный порядок
              const remainingCategories = categories.filter(cat => 
                !categoryOrder.includes(cat.slug)
              );
              
              // Объединяем массивы
              const orderedCategories = [...sortedCategories, ...remainingCategories];
              
              // Рендерим карточки категорий
              return orderedCategories.map(category => {
                const { icon, bg, imgUrl } = getCategoryAssets(category.slug);
                
                return (
                  <Link 
                    key={category.id} 
                    href={`/catalog/${category.slug}`} 
                    className="category-tile flex flex-col overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    <div className={`h-24 md:h-32 bg-gradient-to-br ${bg} relative flex items-center justify-center`}>
                      <img 
                        src={imgUrl} 
                        alt={category.name} 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
                        loading="lazy"
                      />
                      {icon}
                    </div>
                    <div className="p-2 bg-card h-10 flex items-center justify-center">
                      <span className="text-sm font-medium text-center line-clamp-1">{category.name}</span>
                    </div>
                  </Link>
                );
              });
            })()}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-8 md:py-12 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-unbounded text-xl md:text-3xl">Популярные товары</h2>
            <Link href="/catalog" className="text-sm text-primary hover:underline">Весь каталог</Link>
          </div>
          <ProductGrid filters={{ 
            availability: false, 
            storeIds: [], 
            tags: ["Топ продаж"] 
          }} />
          
          <div className="text-center mt-6 md:mt-8">
            <Link href="/catalog">
              <Button variant="outline" className="w-full md:w-auto">
                Перейти в каталог
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Store Locations */}
      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-unbounded text-xl md:text-3xl">Наши магазины</h2>
            <Link href="/stores" className="text-sm text-primary hover:underline">Все магазины</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {stores?.map((store, index) => (
              index < 2 && <StoreCard key={store.id} store={store} />
            ))}
          </div>
          
          {/* Mobile-only button for stores page */}
          {stores && stores.length > 2 && (
            <div className="mt-6 text-center md:hidden">
              <Link href="/stores">
                <Button variant="outline" className="w-full">
                  Все магазины ({stores.length})
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

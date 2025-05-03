import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import Carousel from '@/components/home/carousel';
import ProductGrid from '@/components/products/product-grid';
import StoreCard from '@/components/home/store-card';
import { useQuery } from '@tanstack/react-query';
import { Store } from '@shared/schema';

const HomePage = () => {
  const { data: stores } = useQuery<Store[]>({ 
    queryKey: ['/api/stores']
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
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 bg-card p-4 md:p-6 rounded-lg shadow-sm">
            <div>
              <h3 className="text-xl md:text-2xl font-unbounded mb-1">DAMASK SHOP</h3>
              <p className="text-muted-foreground">Магазин вейп продукции в Самаре</p>
            </div>
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
            <Link href="/catalog/pods" className="category-tile flex flex-col overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="h-24 md:h-32 bg-gradient-to-br from-primary/10 to-primary/40 relative flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1562576661-c92d55da39f5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300" 
                  alt="Поды" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M18.178 2.337a3 3 0 0 0-4.242 0l-8.48 8.482a6 6 0 0 0 8.485 8.485l8.486-8.485"></path><path d="M8.75 13.4 5.9 16.244a1 1 0 0 0 0 1.414l.342.342a1 1 0 0 0 1.414 0l2.83-2.83"></path></svg>
              </div>
              <div className="p-2 bg-card">
                <span className="text-sm font-medium">Поды</span>
              </div>
            </Link>
            
            <Link href="/catalog/liquids" className="category-tile flex flex-col overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="h-24 md:h-32 bg-gradient-to-br from-blue-500/10 to-blue-500/40 relative flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1558452919-d8a1c7d91d0f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300" 
                  alt="Жидкости" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M8.67 2h6.66c.67 0 1.34.34 1.34 1.34C16.67 4.67 15.67 6 14 6h-4c-1.67 0-2.67-1.33-2.67-2.66C7.33 2.34 8 2 8.67 2Z"></path><path d="M4 15c0-5 2-9 8-9s8 4 8 9v1c0 3-1 5-4 5h-8c-3 0-4-2-4-5v-1Z"></path><path d="M4 15h16"></path></svg>
              </div>
              <div className="p-2 bg-card">
                <span className="text-sm font-medium">Жидкости</span>
              </div>
            </Link>
            
            <Link href="/catalog/disposables" className="category-tile flex flex-col overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="h-24 md:h-32 bg-gradient-to-br from-purple-500/10 to-purple-500/40 relative flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1541418950054-c12804e149d9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300" 
                  alt="Одноразовые устройства" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M6 2v20l12-10Z"></path></svg>
              </div>
              <div className="p-2 bg-card">
                <span className="text-sm font-medium">Одноразки</span>
              </div>
            </Link>
            
            <Link href="/catalog/hookahs" className="category-tile flex flex-col overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="h-24 md:h-32 bg-gradient-to-br from-green-500/10 to-green-500/40 relative flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1578670407805-f4682dbe74f9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300" 
                  alt="Кальяны" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M4 8h9a3 3 0 0 0 3-3 1 1 0 0 0-1-1h-3"></path><path d="M4 8h5a3 3 0 0 1 3 3 1 1 0 0 1-1 1h-3"></path><path d="M4 16h9a3 3 0 0 0 3-3 1 1 0 0 0-1-1h-3"></path><path d="M8 21l2 -14"></path></svg>
              </div>
              <div className="p-2 bg-card">
                <span className="text-sm font-medium">Кальяны</span>
              </div>
            </Link>
            
            <Link href="/catalog/tobacco" className="category-tile flex flex-col overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="h-24 md:h-32 bg-gradient-to-br from-amber-500/10 to-amber-500/40 relative flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1519420573924-65fcd9954486?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300" 
                  alt="Табак" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M2 20h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H2"></path><path d="M2 4h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2"></path><path d="M2 4v16"></path></svg>
              </div>
              <div className="p-2 bg-card">
                <span className="text-sm font-medium">Табак</span>
              </div>
            </Link>
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

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
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-card h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-gradient-to-b from-background to-secondary" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="font-unbounded font-bold text-3xl md:text-6xl mb-4">DAMASK SHOP</h1>
            <p className="text-lg md:text-2xl text-muted-foreground mb-6 md:mb-8">Магазин вейп продукции в Самаре</p>
            <Link href="/catalog">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium">
                Смотреть каталог
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Mobile Quick Categories */}
      <section className="py-6 bg-background md:hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-3">
            <Link href="/catalog/pods" className="flex flex-col items-center p-3 bg-secondary rounded-lg hover:bg-primary/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-primary"><path d="M18.178 2.337a3 3 0 0 0-4.242 0l-8.48 8.482a6 6 0 0 0 8.485 8.485l8.486-8.485"></path><path d="M8.75 13.4 5.9 16.244a1 1 0 0 0 0 1.414l.342.342a1 1 0 0 0 1.414 0l2.83-2.83"></path></svg>
              <span className="text-xs">Поды</span>
            </Link>
            <Link href="/catalog/liquids" className="flex flex-col items-center p-3 bg-secondary rounded-lg hover:bg-primary/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-primary"><path d="M8.67 2h6.66c.67 0 1.34.34 1.34 1.34C16.67 4.67 15.67 6 14 6h-4c-1.67 0-2.67-1.33-2.67-2.66C7.33 2.34 8 2 8.67 2Z"></path><path d="M4 15c0-5 2-9 8-9s8 4 8 9v1c0 3-1 5-4 5h-8c-3 0-4-2-4-5v-1Z"></path><path d="M4 15h16"></path></svg>
              <span className="text-xs">Жидкости</span>
            </Link>
            <Link href="/catalog/disposables" className="flex flex-col items-center p-3 bg-secondary rounded-lg hover:bg-primary/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-primary"><path d="M6 2v20l12-10Z"></path></svg>
              <span className="text-xs">Одноразки</span>
            </Link>
          </div>
        </div>
      </section>
      
      {/* News & Promotions Carousel */}
      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-unbounded text-xl md:text-3xl">Новости и акции</h2>
            <Link href="/news" className="text-sm text-primary hover:underline">Все новости</Link>
          </div>
          <Carousel />
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

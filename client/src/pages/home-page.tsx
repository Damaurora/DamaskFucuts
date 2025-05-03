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
        <div className="bg-card h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-gradient-to-b from-background to-secondary" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="font-unbounded font-bold text-4xl md:text-6xl mb-4">DAMASK SHOP</h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">Магазин вейп продукции в Самаре</p>
            <Link href="/catalog">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium">
                Смотреть каталог
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* News & Promotions Carousel */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-unbounded text-2xl md:text-3xl mb-8">Новости и акции</h2>
          <Carousel />
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-4">
          <h2 className="font-unbounded text-2xl md:text-3xl mb-8">Популярные товары</h2>
          <ProductGrid filters={{ 
            availability: false, 
            storeIds: [], 
            tags: ["Топ продаж"] 
          }} />
          
          <div className="text-center mt-8">
            <Link href="/catalog">
              <Button variant="outline" size="lg">
                Перейти в каталог
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Store Locations */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-unbounded text-2xl md:text-3xl mb-8">Наши магазины</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stores?.map(store => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

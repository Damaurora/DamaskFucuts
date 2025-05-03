import { useQuery } from '@tanstack/react-query';
import { Store } from '@shared/schema';
import StoreCard from '@/components/home/store-card';

const StoresPage = () => {
  const { data: stores, isLoading } = useQuery<Store[]>({ 
    queryKey: ['/api/stores']
  });
  
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h1 className="font-unbounded text-2xl md:text-3xl mb-8">Наши магазины</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-secondary"></div>
                <div className="p-6">
                  <div className="h-8 bg-secondary rounded w-2/3 mb-6"></div>
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="h-5 w-5 bg-secondary rounded-full mr-3"></div>
                      <div className="h-5 bg-secondary rounded w-3/4"></div>
                    </div>
                    <div className="flex">
                      <div className="h-5 w-5 bg-secondary rounded-full mr-3"></div>
                      <div className="h-10 bg-secondary rounded w-2/4"></div>
                    </div>
                    <div className="flex">
                      <div className="h-5 w-5 bg-secondary rounded-full mr-3"></div>
                      <div className="h-5 bg-secondary rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : stores && stores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stores.map(store => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Информация о магазинах недоступна</p>
          </div>
        )}
        
        {/* Additional Info */}
        <div className="mt-12 bg-card rounded-lg p-8">
          <h2 className="font-unbounded text-xl mb-4">О наших магазинах</h2>
          <p className="text-muted-foreground mb-4">
            Наши магазины предлагают широкий ассортимент вейп продукции от ведущих мировых производителей. 
            Мы работаем напрямую с поставщиками, чтобы гарантировать качество и оригинальность всех товаров.
          </p>
          <p className="text-muted-foreground mb-4">
            В наших магазинах вы сможете:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
            <li>Получить профессиональную консультацию от опытных продавцов</li>
            <li>Узнать о новинках вейп индустрии</li>
            <li>Протестировать жидкости перед покупкой</li>
            <li>Приобрести качественные устройства и аксессуары</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default StoresPage;

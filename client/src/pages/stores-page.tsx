import { useQuery } from '@tanstack/react-query';
import { Store } from '@shared/schema';
import StoreCard from '@/components/home/store-card';
import { MapPin, Phone, Clock, Navigation, MapPinned, Store as StoreIcon } from 'lucide-react';

const StoresPage = () => {
  const { data: stores, isLoading } = useQuery<Store[]>({ 
    queryKey: ['/api/stores']
  });
  
  return (
    <>
      {/* Hero section с картой */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        {/* Карта как фон */}
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 z-0">
          <img 
            src="https://images.unsplash.com/photo-1596741964346-791466b552b6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=2000&h=800" 
            alt="Карта Самары" 
            className="w-full h-full object-cover opacity-70 dark:opacity-40 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        
        {/* Контент поверх карты */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="bg-primary text-white h-10 w-10 rounded-full flex items-center justify-center">
                <MapPinned className="h-5 w-5" />
              </div>
            </div>
            <h1 className="font-unbounded text-3xl md:text-4xl mb-3">Наши магазины</h1>
            <p className="max-w-2xl mx-auto text-muted-foreground md:text-lg">
              Мы ждем вас в любом из наших удобно расположенных салонов. Найдите ближайший и приходите!
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Информация для клиентов */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border border-border/40 text-center">
              <div className="inline-flex items-center justify-center mb-4 bg-primary/10 text-primary h-12 w-12 rounded-full">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-unbounded text-lg mb-2">Режим работы</h3>
              <p className="text-muted-foreground">Все магазины работают ежедневно с 10:00 до 22:00 без перерывов и выходных</p>
            </div>
            
            <div className="bg-card rounded-lg p-6 border border-border/40 text-center">
              <div className="inline-flex items-center justify-center mb-4 bg-primary/10 text-primary h-12 w-12 rounded-full">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-unbounded text-lg mb-2">Связаться с нами</h3>
              <p className="text-muted-foreground">Вы можете получить консультацию позвонив в любой из наших магазинов</p>
            </div>
            
            <div className="bg-card rounded-lg p-6 border border-border/40 text-center">
              <div className="inline-flex items-center justify-center mb-4 bg-primary/10 text-primary h-12 w-12 rounded-full">
                <StoreIcon className="h-6 w-6" />
              </div>
              <h3 className="font-unbounded text-lg mb-2">Широкий ассортимент</h3>
              <p className="text-muted-foreground">Во всех магазинах представлен полный ассортимент нашей продукции</p>
            </div>
          </div>
          
          <h2 className="font-unbounded text-2xl mb-8 flex items-center">
            <MapPin className="h-6 w-6 mr-2 text-primary" />
            Адреса магазинов
          </h2>
        
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden border border-border/40 animate-pulse">
                  <div className="md:flex">
                    <div className="h-32 md:w-2/5 bg-secondary"></div>
                    <div className="p-6 md:w-3/5">
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
            <div className="text-center py-10 border border-dashed border-muted-foreground/50 rounded-lg">
              <StoreIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-muted-foreground">Информация о магазинах недоступна</p>
            </div>
          )}
          
          {/* Дополнительная информация */}
          <div className="mt-16 bg-card rounded-lg p-8 border border-border/40 relative overflow-hidden">
            {/* Декоративный элемент */}
            <div className="absolute -right-8 -top-8 h-32 w-32 bg-primary/5 rounded-full"></div>
            <div className="absolute right-12 top-12 h-16 w-16 bg-primary/10 rounded-full"></div>
            
            <div className="relative z-10">
              <h2 className="font-unbounded text-2xl mb-4">О наших магазинах</h2>
              <p className="text-muted-foreground mb-4">
                Наши магазины предлагают широкий ассортимент вейп продукции от ведущих мировых производителей. 
                Мы работаем напрямую с поставщиками, чтобы гарантировать качество и оригинальность всех товаров.
              </p>
              <p className="text-muted-foreground mb-4">
                В наших магазинах вы сможете:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Получить профессиональную консультацию от опытных продавцов</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Узнать о новинках вейп индустрии</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Протестировать жидкости перед покупкой</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Приобрести качественные устройства и аксессуары</span>
                </li>
              </ul>
              <div className="text-sm text-muted-foreground bg-secondary/40 p-4 rounded-md">
                <p className="font-semibold mb-1">Важная информация</p>
                <p>Вся продукция предназначена для совершеннолетних лиц. При посещении магазина необходимо иметь при себе паспорт для подтверждения возраста.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StoresPage;

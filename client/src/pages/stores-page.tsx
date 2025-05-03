import { useQuery } from '@tanstack/react-query';
import { Store } from '@shared/schema';
import StoreCard from '@/components/home/store-card';
import { MapPin, Phone, Clock, Navigation, MapPinned, Store as StoreIcon, CheckCircle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

const StoresPage = () => {
  const { data: stores, isLoading } = useQuery<Store[]>({ 
    queryKey: ['/api/stores']
  });
  
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Анимация появления контента
    setLoaded(true);
  }, []);
  
  return (
    <>
      {/* Hero section с картой */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        {/* Карта как фон */}
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 z-0">
          <img 
            src="https://images.unsplash.com/photo-1596741964346-791466b552b6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=2000&h=800" 
            alt="Карта Самары" 
            className="w-full h-full object-cover opacity-70 dark:opacity-40 object-center transition-opacity duration-1000"
            style={{ opacity: loaded ? "0.7" : "0" }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        
        {/* Контент поверх карты */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="container mx-auto px-4 text-center">
            <div 
              className="inline-flex items-center justify-center mb-4"
              style={{
                opacity: 0,
                animation: 'zoomIn 0.6s ease-out forwards',
                animationDelay: '0.2s'
              }}
            >
              <div className="bg-primary text-white h-10 w-10 rounded-full flex items-center justify-center">
                <MapPinned className="h-5 w-5" />
              </div>
            </div>
            <h1 
              className="font-unbounded text-3xl md:text-4xl mb-3"
              style={{
                opacity: 0,
                animation: 'fadeInUp 0.6s ease-out forwards',
                animationDelay: '0.3s'
              }}
            >
              Наши магазины
            </h1>
            <p 
              className="max-w-2xl mx-auto text-muted-foreground md:text-lg"
              style={{
                opacity: 0,
                animation: 'fadeInUp 0.6s ease-out forwards',
                animationDelay: '0.4s'
              }}
            >
              Мы ждем вас в любом из наших удобно расположенных салонов. Найдите ближайший и приходите!
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Информация для клиентов */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <Clock className="h-6 w-6" />,
                title: "Режим работы",
                description: "Все магазины работают ежедневно с 10:00 до 22:00 без перерывов и выходных",
                delay: 0.1
              },
              {
                icon: <Phone className="h-6 w-6" />,
                title: "Связаться с нами",
                description: "Вы можете получить консультацию позвонив в любой из наших магазинов",
                delay: 0.2
              },
              {
                icon: <StoreIcon className="h-6 w-6" />,
                title: "Широкий ассортимент",
                description: "Во всех магазинах представлен полный ассортимент нашей продукции",
                delay: 0.3
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-card rounded-lg p-6 border border-border/40 text-center hover:shadow-md transition-all duration-300"
                style={{
                  opacity: 0,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  animationDelay: `${item.delay}s`
                }}
              >
                <div className="inline-flex items-center justify-center mb-4 bg-primary/10 text-primary h-12 w-12 rounded-full">
                  {item.icon}
                </div>
                <h3 className="font-unbounded text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
          
          <h2 
            className="font-unbounded text-2xl mb-8 flex items-center"
            style={{
              opacity: 0,
              animation: 'fadeInLeft 0.6s ease-out forwards',
              animationDelay: '0.1s'
            }}
          >
            <MapPin className="h-6 w-6 mr-2 text-primary" />
            Адреса магазинов
          </h2>
        
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className="bg-card rounded-lg overflow-hidden border border-border/40"
                  style={{
                    animation: 'pulse 2s cubic-bezier(.4,0,.6,1) infinite',
                    animationDelay: `${i * 0.15}s`
                  }}
                >
                  <div className="md:flex">
                    <div className="h-32 md:w-2/5 bg-secondary/40 relative overflow-hidden">
                      <div className="absolute inset-0 animate-shimmer"></div>
                    </div>
                    <div className="p-6 md:w-3/5">
                      <div className="h-8 bg-secondary/40 rounded w-2/3 mb-6 relative overflow-hidden">
                        <div className="absolute inset-0 animate-shimmer"></div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex">
                          <div className="h-5 w-5 bg-secondary/40 rounded-full mr-3 flex-shrink-0"></div>
                          <div className="h-5 bg-secondary/30 rounded w-3/4 relative overflow-hidden">
                            <div className="absolute inset-0 animate-shimmer"></div>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="h-5 w-5 bg-secondary/40 rounded-full mr-3 flex-shrink-0"></div>
                          <div className="h-10 bg-secondary/30 rounded w-2/4 relative overflow-hidden">
                            <div className="absolute inset-0 animate-shimmer"></div>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="h-5 w-5 bg-secondary/40 rounded-full mr-3 flex-shrink-0"></div>
                          <div className="h-5 bg-secondary/30 rounded w-1/3 relative overflow-hidden">
                            <div className="absolute inset-0 animate-shimmer"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : stores && stores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stores.map((store, index) => (
                <StoreCard key={store.id} store={store} index={index} />
              ))}
            </div>
          ) : (
            <div 
              className="text-center py-12 border border-dashed border-muted-foreground/50 rounded-lg bg-card/50"
              style={{
                opacity: 0,
                animation: 'fadeIn 0.8s ease-out forwards'
              }}
            >
              <StoreIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-40" />
              <p className="text-muted-foreground text-lg">Информация о магазинах недоступна</p>
              <p className="text-muted-foreground text-sm mt-2">Пожалуйста, попробуйте позже</p>
            </div>
          )}
          
          {/* Дополнительная информация */}
          <div 
            className="mt-16 bg-card rounded-lg p-8 border border-border/40 relative overflow-hidden"
            style={{
              opacity: 0,
              animation: 'fadeInUp 0.8s ease-out forwards',
              animationDelay: '0.4s'
            }}
          >
            {/* Декоративные элементы */}
            <div className="absolute -right-8 -top-8 h-32 w-32 bg-primary/5 rounded-full"></div>
            <div className="absolute right-12 top-12 h-16 w-16 bg-primary/10 rounded-full"></div>
            <div className="absolute left-32 bottom-12 h-20 w-20 bg-primary/5 rounded-full"></div>
            
            <div className="relative z-10">
              <h2 className="font-unbounded text-2xl mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-primary" />
                О наших магазинах
              </h2>
              <p className="text-muted-foreground mb-4">
                Наши магазины предлагают широкий ассортимент вейп продукции от ведущих мировых производителей. 
                Мы работаем напрямую с поставщиками, чтобы гарантировать качество и оригинальность всех товаров.
              </p>
              <p className="text-muted-foreground mb-4 font-medium">
                В наших магазинах вы сможете:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {[
                  "Получить профессиональную консультацию от опытных продавцов",
                  "Узнать о новинках вейп индустрии",
                  "Протестировать жидкости перед покупкой",
                  "Приобрести качественные устройства и аксессуары"
                ].map((item, index) => (
                  <li 
                    key={index} 
                    className="flex items-start"
                    style={{
                      opacity: 0,
                      animation: 'fadeInLeft 0.5s ease-out forwards',
                      animationDelay: `${0.5 + index * 0.1}s`
                    }}
                  >
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div 
                className="text-sm text-muted-foreground bg-secondary/40 p-4 rounded-md border border-border/40"
                style={{
                  opacity: 0,
                  animation: 'fadeIn 0.6s ease-out forwards',
                  animationDelay: '0.9s'
                }}
              >
                <p className="font-medium mb-1 flex items-center">
                  <Info className="h-4 w-4 mr-1.5 text-primary" />
                  Важная информация
                </p>
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

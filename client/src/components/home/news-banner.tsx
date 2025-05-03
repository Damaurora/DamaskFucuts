import { useRef, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { News } from '@shared/schema';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CircleAlert, Flame, Leaf, Star } from 'lucide-react';

interface NewsResponse {
  news: News[];
  totalNews: number;
  totalPages: number;
}

const NewsBanner = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const { data, isLoading } = useQuery<NewsResponse>({ 
    queryKey: ['/api/news?featured=true']
  });
  
  const newsItems = data?.news || [];

  // Обновляем индикаторы прокрутки
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // Мы больше не устанавливаем градиенты, но сохраняем функцию для индикаторов
      setShowLeftGradient(scrollLeft > 20);
      setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      // Инициализация градиентов
      handleScroll();
      
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [data]);

  // Автоматическая анимированная прокрутка каждые 6 секунд
  useEffect(() => {
    if (newsItems.length <= 1) return;
    
    const timer = setInterval(() => {
      if (scrollRef.current && !isDragging) {
        const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
        
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          // Если достигли конца, прокручиваем к началу с анимацией
          scrollRef.current.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          // Иначе прокручиваем на ширину одного элемента
          scrollRef.current.scrollBy({
            left: 370, // Примерная ширина элемента
            behavior: 'smooth'
          });
        }
        
        // Обновляем градиенты после прокрутки
        setTimeout(handleScroll, 500);
      }
    }, 6000);
    
    return () => clearInterval(timer);
  }, [newsItems.length, isDragging]);

  // Обработчики мыши для драг-н-дроп скроллинга
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    if (scrollRef.current) {
      const x = e.pageX - (scrollRef.current.offsetLeft || 0);
      const walk = (x - startX) * 2; // Скорость скролла
      scrollRef.current.scrollLeft = scrollLeft - walk;
      
      // Обновляем градиенты
      handleScroll();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Обработчики тач-событий для мобильных устройств
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    if (scrollRef.current) {
      const x = e.touches[0].pageX - (scrollRef.current.offsetLeft || 0);
      const walk = (x - startX) * 2;
      scrollRef.current.scrollLeft = scrollLeft - walk;
      
      // Обновляем градиенты
      handleScroll();
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Получение бейджа по типу новости
  const getBadgeClass = (type: string) => {
    switch (type) {
      case 'news':
        return 'bg-primary text-white';
      case 'promotion':
        return 'bg-green-600 text-white';
      case 'event':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-primary text-white';
    }
  };

  // Получение иконки по типу новости
  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'news':
        return <Star className="h-3 w-3 mr-1" />;
      case 'promotion':
        return <Flame className="h-3 w-3 mr-1" />;
      case 'event':
        return <Leaf className="h-3 w-3 mr-1" />;
      default:
        return <CircleAlert className="h-3 w-3 mr-1" />;
    }
  };

  const getBadgeText = (type: string) => {
    switch (type) {
      case 'news':
        return 'Новинка';
      case 'promotion':
        return 'Акция';
      case 'event':
        return 'Событие';
      default:
        return 'Новость';
    }
  };

  // Скелетон загрузки
  if (isLoading) {
    return (
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-card/50 to-secondary/10 rounded-lg">
        <div className="flex gap-6 py-6 px-4 md:px-8 animate-pulse overflow-hidden min-h-[400px] md:min-h-[520px]">
          {[...Array(3)].map((_, index) => (
            <div 
              key={index} 
              className="min-w-[100%] sm:min-w-[350px] md:min-w-[500px] flex-shrink-0 rounded-lg h-[420px] md:h-[520px] relative overflow-hidden"
              style={{ 
                animationDelay: `${index * 0.2}s`,
                animation: 'pulse 2s cubic-bezier(.4,0,.6,1) infinite'
              }}
            >
              <div className="h-[240px] md:h-[320px] w-full bg-secondary/40 rounded-t-lg relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer"></div>
              </div>
              <div className="p-4 md:p-8 space-y-4">
                <div className="h-7 md:h-8 bg-secondary/40 rounded w-2/3 relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer"></div>
                </div>
                <div className="h-5 md:h-6 bg-secondary/30 rounded w-full relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer"></div>
                </div>
                <div className="h-5 md:h-6 bg-secondary/30 rounded w-11/12 relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer"></div>
                </div>
                <div className="h-5 md:h-6 bg-secondary/30 rounded w-4/5 relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer"></div>
                </div>
                <div className="h-4 md:h-5 bg-secondary/40 rounded w-1/4 mt-6 relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!newsItems || newsItems.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto py-2 md:py-6">
      {/* Индикатор скролла */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20 flex space-x-1 mb-2">
        {newsItems.map((_, index) => (
          <div 
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              scrollRef.current && 
              index * 300 <= scrollRef.current.scrollLeft && 
              (index + 1) * 300 > scrollRef.current.scrollLeft
                ? 'w-8 bg-primary' 
                : 'w-2 bg-secondary/50'
            }`}
          />
        ))}
      </div>
      
      {/* Скроллируемый контейнер */}
      <div 
        ref={scrollRef}
        className="overflow-x-auto overflow-y-hidden scrollbar-hide rounded-xl"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          cursor: isDragging ? 'grabbing' : 'grab',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div className="flex gap-6 py-4 min-h-[380px] md:min-h-[460px] px-2">
          {newsItems.map((item, index) => (
            <div 
              key={item.id} 
              className={`relative min-w-[85%] sm:min-w-[320px] md:min-w-[360px] max-w-sm flex-shrink-0 bg-card rounded-xl overflow-hidden border border-border/40 hover:shadow-xl transition-all duration-500 ${
                activeItem === item.id ? 'ring-2 ring-primary' : ''
              }`}
              onMouseEnter={() => setActiveItem(item.id)}
              onMouseLeave={() => setActiveItem(null)}
              style={{
                transform: `translateY(${isDragging ? 0 : '0px'})`,
                transition: 'all 0.5s ease',
                animationDelay: `${index * 0.15}s`,
                animation: 'fadeInUp 0.5s ease-out forwards',
                opacity: 0,
              }}
            >
              <div className="h-52 md:h-60 relative overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-1000"
                  style={{
                    transform: activeItem === item.id ? 'scale(1.05)' : 'scale(1)',
                  }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between items-center">
                    <Badge className={`${getBadgeClass(item.type)} flex items-center px-3 py-1 shadow-md`}>
                      {getBadgeIcon(item.type)}
                      {getBadgeText(item.type)}
                    </Badge>
                    <div className="text-xs text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                      {new Date(item.publishDate || item.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-unbounded text-lg md:text-xl mb-3 line-clamp-2 transition-colors duration-300"
                  style={{
                    color: activeItem === item.id ? 'hsl(var(--primary))' : ''
                  }}
                >
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{item.description}</p>
                <Link 
                  href={`/news/${item.id}`} 
                  className="inline-flex items-center text-sm text-primary hover:text-primary/90 transition-all group mt-2"
                >
                  <span className="border-b border-transparent group-hover:border-primary transition-all">Подробнее</span>
                  <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsBanner;
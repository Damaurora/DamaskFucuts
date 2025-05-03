import { useRef, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { News } from '@shared/schema';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';

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

  const { data, isLoading } = useQuery<NewsResponse>({ 
    queryKey: ['/api/news?featured=true']
  });
  
  const newsItems = data?.news || [];

  // Обновляем градиенты когда скроллим
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
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

  if (isLoading) {
    return (
      <div className="relative rounded-lg overflow-hidden bg-card">
        <div className="flex gap-6 p-4 animate-pulse">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="min-w-[280px] md:min-w-[320px] flex-shrink-0 bg-secondary/30 rounded-lg h-[320px]"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!newsItems || newsItems.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Левый градиент для индикации горизонтального скролла */}
      {showLeftGradient && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      )}
      
      {/* Правый градиент для индикации горизонтального скролла */}
      {showRightGradient && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      )}
      
      {/* Скроллируемый контейнер */}
      <div 
        ref={scrollRef}
        className="overflow-x-auto overflow-y-hidden scrollbar-hide"
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
        <div className="flex gap-6 py-4 px-2">
          {newsItems.map((item) => (
            <div 
              key={item.id} 
              className="min-w-[280px] md:min-w-[320px] flex-shrink-0 bg-card rounded-lg overflow-hidden border border-border/40 hover:shadow-md transition-all duration-300"
            >
              <div className="h-40 relative overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge className={getBadgeClass(item.type)}>
                    {getBadgeText(item.type)}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-unbounded text-lg mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{item.description}</p>
                <Link href={`/news/${item.id}`} className="inline-block text-sm text-primary hover:text-primary/80 transition-all">
                  Подробнее
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 inline-block ml-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
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
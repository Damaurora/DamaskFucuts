import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { News } from '@shared/schema';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';

interface NewsResponse {
  news: News[];
  totalNews: number;
  totalPages: number;
}

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { data, isLoading } = useQuery<NewsResponse>({ 
    queryKey: ['/api/news?featured=true']
  });
  
  const newsItems = data?.news || [];
  const totalSlides = newsItems.length || 0;
  
  // Auto-rotate slides
  useEffect(() => {
    if (totalSlides <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [totalSlides]);
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  const goToPrevSlide = () => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  
  const goToNextSlide = () => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };
  
  // Touch handlers for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left
      goToNextSlide();
    }
    
    if (touchStart - touchEnd < -100) {
      // Swipe right
      goToPrevSlide();
    }
  };
  
  if (isLoading) {
    return (
      <div className="relative overflow-hidden h-80 md:h-96 bg-card rounded-lg animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (!newsItems || newsItems.length === 0) {
    return null;
  }
  
  return (
    <div className="relative">
      {/* Carousel Controls */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-secondary text-primary hover:text-primary-foreground rounded-full"
        onClick={goToPrevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous slide</span>
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-secondary text-primary hover:text-primary-foreground rounded-full"
        onClick={goToNextSlide}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next slide</span>
      </Button>
      
      {/* Carousel Items */}
      <div 
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={containerRef}
      >
        <div 
          className="flex transition-all duration-300" 
          style={{ 
            transform: `translateX(-${currentSlide * 100}%)`,
            width: `${newsItems.length * 100}%`
          }}
        >
          {newsItems.map((item) => (
            <div 
              key={item.id} 
              className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] p-4"
              style={{ width: `${100 / newsItems.length}%` }}
            >
              <div className="bg-card rounded-lg overflow-hidden h-full">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <Badge 
                    className={
                      item.type === 'news' 
                        ? 'bg-primary text-white' 
                        : item.type === 'promotion' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-blue-600 text-white'
                    }
                  >
                    {item.type === 'news' ? 'Новинка' : item.type === 'promotion' ? 'Акция' : 'Событие'}
                  </Badge>
                  <h3 className="font-unbounded text-xl mb-2 mt-4">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                  <Link href={`/news/${item.id}`} className="inline-block mt-4 text-primary hover:text-primary/80 transition-all">
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
            </div>
          ))}
        </div>
      </div>
      
      {/* Carousel Dots */}
      <div className="flex justify-center mt-6">
        {newsItems.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full mx-1 ${
              index === currentSlide ? 'bg-primary' : 'bg-muted-foreground'
            }`}
            onClick={() => goToSlide(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;

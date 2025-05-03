import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { News } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Newspaper, TagIcon, CalendarDays } from 'lucide-react';

const NewsPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'promotions' | 'events'>('all');
  const [page, setPage] = useState(1);
  const pageSize = 6;
  
  type NewsResponse = {
    news: News[];
    totalNews: number;
    totalPages: number;
  };

  const { data, isLoading } = useQuery<NewsResponse>({ 
    queryKey: [`/api/news?type=${activeTab === 'all' ? '' : activeTab}&page=${page}&pageSize=${pageSize}`]
  });
  
  const totalPages = data?.totalPages || 1;
  
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h1 className="font-unbounded text-2xl md:text-3xl mb-8">Новости и акции</h1>
        
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={(value) => {
            setActiveTab(value as 'all' | 'news' | 'promotions' | 'events');
            setPage(1);
          }}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="news">Новости</TabsTrigger>
            <TabsTrigger value="promotions">Акции</TabsTrigger>
            <TabsTrigger value="events">События</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="flex flex-col h-full animate-pulse">
                <div className="h-48 bg-secondary"></div>
                <CardHeader>
                  <div className="h-6 w-1/3 bg-secondary rounded mb-2"></div>
                  <div className="h-5 w-3/4 bg-secondary rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-secondary rounded"></div>
                    <div className="h-4 bg-secondary rounded"></div>
                    <div className="h-4 w-2/3 bg-secondary rounded"></div>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto">
                  <div className="h-4 w-1/4 bg-secondary rounded"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : data?.news && data.news.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.news.map((item) => (
                <Card key={item.id} className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-lg transition-all group">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge 
                        className={
                          item.type === 'news' 
                            ? 'bg-primary text-white font-medium' 
                            : item.type === 'promotion' 
                              ? 'bg-green-600 text-white font-medium' 
                              : 'bg-blue-600 text-white font-medium'
                        }
                      >
                        {item.type === 'news' ? (
                          <div className="flex items-center">
                            <Newspaper className="h-3 w-3 mr-1" />
                            Новинка
                          </div>
                        ) : item.type === 'promotion' ? (
                          <div className="flex items-center">
                            <TagIcon className="h-3 w-3 mr-1" />
                            Акция
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            Событие
                          </div>
                        )}
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-16">
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-muted-foreground text-sm line-clamp-3">{item.description}</p>
                  </CardContent>
                  <CardFooter className="mt-auto pt-0">
                    <Link href={`/news/${item.id}`}>
                      <Button variant="outline" size="sm" className="w-full text-primary hover:text-primary/80 transition-all">
                        Подробнее
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 ml-1" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <Pagination className="mt-10">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                    className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink 
                        href="#" 
                        isActive={pageNumber === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) setPage(page + 1);
                    }}
                    className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Новостей не найдено</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsPage;

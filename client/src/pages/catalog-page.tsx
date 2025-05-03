import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useParams, Link } from 'wouter';
import { Category } from '@shared/schema';
import CategorySidebar from '@/components/products/category-sidebar';
import ProductGrid from '@/components/products/product-grid';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, ChevronRight, X, Search } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

const CatalogPage = () => {
  const [location] = useLocation();
  const params = useParams<{ categorySlug?: string }>();
  const categorySlug = params.categorySlug;
  const isMobile = useMobile();
  
  // State for filter drawer
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Get search query from URL if present
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const searchQuery = searchParams.get('search') || '';
  
  const [filters, setFilters] = useState({
    availability: false,
    storeIds: [] as number[],
    tags: [] as string[]
  });
  
  const { data: categories } = useQuery<Category[]>({ 
    queryKey: ['/api/categories']
  });
  
  const selectedCategory = categories?.find(c => c.slug === categorySlug);
  
  const handleFilterChange = (newFilters: {
    availability: boolean;
    storeIds: number[];
    tags: string[];
  }) => {
    setFilters(newFilters);
    if (isMobile) {
      setIsFiltersOpen(false);
    }
  };
  
  // Категории для быстрого доступа в мобильной версии
  const renderMobileCategories = () => {
    if (!categories) return null;
    
    return (
      <div className="overflow-x-auto pb-2 -mx-4 px-4 mb-4">
        <div className="flex space-x-2 min-w-max">
          <Link href="/catalog">
            <Button 
              variant={!categorySlug ? "default" : "outline"} 
              size="sm" 
              className="whitespace-nowrap"
            >
              Все товары
            </Button>
          </Link>
          {categories.map(category => (
            <Link key={category.id} href={`/catalog/${category.slug}`}>
              <Button 
                variant={category.slug === categorySlug ? "default" : "outline"} 
                size="sm"
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <section className="py-6 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <h1 className="font-unbounded text-xl md:text-3xl mb-4">
          {searchQuery 
            ? `Поиск: ${searchQuery}` 
            : selectedCategory 
              ? selectedCategory.name 
              : 'Каталог товаров'
          }
        </h1>
        
        {/* Mobile Categories Carousel */}
        <div className="md:hidden">
          {renderMobileCategories()}
          
          {/* Mobile Filters Button */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              {filters.tags.length > 0 && (
                <span className="inline-flex items-center">
                  <Filter className="h-3 w-3 mr-1" />
                  Фильтры: {filters.tags.length}
                </span>
              )}
            </div>
            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Фильтры
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle>Фильтры</SheetTitle>
                  <SheetDescription>
                    Выберите параметры для фильтрации товаров
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <CategorySidebar onFilterChange={handleFilterChange} />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Button 
                    onClick={() => setIsFiltersOpen(false)} 
                    className="w-full"
                  >
                    Применить фильтры
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row">
          {/* Categories Sidebar - Desktop only */}
          <div className="hidden md:block md:w-1/4 mb-8 md:mb-0 md:pr-6">
            <CategorySidebar onFilterChange={handleFilterChange} />
          </div>
          
          {/* Products Grid */}
          <div className="w-full md:w-3/4">
            <ProductGrid 
              categoryId={selectedCategory?.id}
              searchQuery={searchQuery}
              filters={filters}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogPage;

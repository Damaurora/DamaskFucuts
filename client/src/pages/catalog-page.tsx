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
  
  // Категории в виде плиток с картинками и названиями
  const renderCategoryTiles = () => {
    if (!categories) return null;
    
    // Иконки и фоны для категорий
    const getCategoryAssets = (slug: string) => {
      const assets: {[key: string]: {icon: JSX.Element, bg: string, imgUrl: string}} = {
        // Предустановленные ассеты для известных категорий
        'pods': {
          icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M18.178 2.337a3 3 0 0 0-4.242 0l-8.48 8.482a6 6 0 0 0 8.485 8.485l8.486-8.485"></path><path d="M8.75 13.4 5.9 16.244a1 1 0 0 0 0 1.414l.342.342a1 1 0 0 0 1.414 0l2.83-2.83"></path></svg>,
          bg: 'from-primary/10 to-primary/40',
          imgUrl: 'https://images.unsplash.com/photo-1562576661-c92d55da39f5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300'
        },
        'liquids': {
          icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M8.67 2h6.66c.67 0 1.34.34 1.34 1.34C16.67 4.67 15.67 6 14 6h-4c-1.67 0-2.67-1.33-2.67-2.66C7.33 2.34 8 2 8.67 2Z"></path><path d="M4 15c0-5 2-9 8-9s8 4 8 9v1c0 3-1 5-4 5h-8c-3 0-4-2-4-5v-1Z"></path><path d="M4 15h16"></path></svg>,
          bg: 'from-blue-500/10 to-blue-500/40',
          imgUrl: 'https://images.unsplash.com/photo-1558452919-d8a1c7d91d0f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300'
        },
        'disposables': {
          icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M6 2v20l12-10Z"></path></svg>,
          bg: 'from-purple-500/10 to-purple-500/40',
          imgUrl: 'https://images.unsplash.com/photo-1541418950054-c12804e149d9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300'
        },
        'hookahs': {
          icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M4 8h9a3 3 0 0 0 3-3 1 1 0 0 0-1-1h-3"></path><path d="M4 8h5a3 3 0 0 1 3 3 1 1 0 0 1-1 1h-3"></path><path d="M4 16h9a3 3 0 0 0 3-3 1 1 0 0 0-1-1h-3"></path><path d="M8 21l2 -14"></path></svg>,
          bg: 'from-green-500/10 to-green-500/40',
          imgUrl: 'https://images.unsplash.com/photo-1578670407805-f4682dbe74f9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300'
        },
        'tobacco': {
          icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><path d="M2 20h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H2"></path><path d="M2 4h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2"></path><path d="M2 4v16"></path></svg>,
          bg: 'from-amber-500/10 to-amber-500/40',
          imgUrl: 'https://images.unsplash.com/photo-1519420573924-65fcd9954486?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300'
        },
        // Дефолтный ассет для остальных категорий
        'default': {
          icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>,
          bg: 'from-slate-500/10 to-slate-500/40',
          imgUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300'
        }
      };
      
      return assets[slug] || assets['default'];
    };
    
    // Mobile - показываем горизонтальный скролл
    return (
      <>
        {/* Мобильные категории (горизонтальный скролл) */}
        <div className="md:hidden overflow-x-auto pb-3 -mx-4 px-4 mb-4">
          <div className="flex space-x-3 min-w-max">
            <Link 
              href="/catalog" 
              className={`flex-shrink-0 flex flex-col w-28 overflow-hidden rounded-lg shadow-sm ${!categorySlug ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="h-20 bg-gradient-to-br from-slate-500/10 to-slate-500/40 relative flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300" 
                  alt="Все товары" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              </div>
              <div className="p-2 bg-card text-center">
                <span className="text-xs font-medium">Все товары</span>
              </div>
            </Link>
            
            {categories.map(category => {
              const { icon, bg, imgUrl } = getCategoryAssets(category.slug);
              return (
                <Link 
                  key={category.id} 
                  href={`/catalog/${category.slug}`}
                  className={`flex-shrink-0 flex flex-col w-28 overflow-hidden rounded-lg shadow-sm ${category.slug === categorySlug ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className={`h-20 bg-gradient-to-br ${bg} relative flex items-center justify-center`}>
                    <img 
                      src={imgUrl} 
                      alt={category.name} 
                      className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
                    />
                    {icon}
                  </div>
                  <div className="p-2 bg-card text-center">
                    <span className="text-xs font-medium">{category.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Desktop категории (сетка) */}
        <div className="hidden md:grid md:grid-cols-5 gap-4 mb-8">
          <Link 
            href="/catalog" 
            className={`category-tile flex flex-col overflow-hidden rounded-lg shadow-sm transition-all ${!categorySlug ? 'ring-2 ring-primary ring-inset' : 'hover:shadow-md'}`}
          >
            <div className="h-28 bg-gradient-to-br from-slate-500/10 to-slate-500/40 relative flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=300" 
                alt="Все товары" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            </div>
            <div className="p-3 bg-card text-center">
              <span className="text-sm font-medium">Все товары</span>
            </div>
          </Link>
          
          {categories.map(category => {
            const { icon, bg, imgUrl } = getCategoryAssets(category.slug);
            return (
              <Link 
                key={category.id} 
                href={`/catalog/${category.slug}`}
                className={`category-tile flex flex-col overflow-hidden rounded-lg shadow-sm transition-all ${category.slug === categorySlug ? 'ring-2 ring-primary ring-inset' : 'hover:shadow-md'}`}
              >
                <div className={`h-28 bg-gradient-to-br ${bg} relative flex items-center justify-center`}>
                  <img 
                    src={imgUrl} 
                    alt={category.name} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
                  />
                  {icon}
                </div>
                <div className="p-3 bg-card text-center">
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </>
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
        
        {/* Categories Grid/Carousel */}
        <div>
          {renderCategoryTiles()}
          
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

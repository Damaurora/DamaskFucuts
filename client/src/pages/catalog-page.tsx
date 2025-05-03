import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { Category } from '@shared/schema';
import CategorySidebar from '@/components/products/category-sidebar';
import ProductGrid from '@/components/products/product-grid';

const CatalogPage = () => {
  const [location] = useLocation();
  const params = useParams<{ categorySlug?: string }>();
  const categorySlug = params.categorySlug;
  
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
  };
  
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h1 className="font-unbounded text-2xl md:text-3xl mb-8">
          {searchQuery 
            ? `Поиск: ${searchQuery}` 
            : selectedCategory 
              ? selectedCategory.name 
              : 'Каталог товаров'
          }
        </h1>
        
        <div className="flex flex-col md:flex-row">
          {/* Categories Sidebar */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0 md:pr-6">
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

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import ProductCard from '@/components/products/product-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface ProductGridProps {
  categoryId?: number;
  searchQuery?: string;
  filters?: {
    availability: boolean;
    storeIds: number[];
    tags: string[];
  };
}

const ProductGrid = ({ categoryId, searchQuery, filters }: ProductGridProps) => {
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const pageSize = 9;
  
  // Build query parameters
  const queryParams = new URLSearchParams();
  if (categoryId) queryParams.append('categoryId', categoryId.toString());
  if (searchQuery) queryParams.append('search', searchQuery);
  if (filters?.availability) queryParams.append('inStock', 'true');
  if (filters?.storeIds?.length) {
    filters.storeIds.forEach(id => queryParams.append('storeId', id.toString()));
  }
  if (filters?.tags?.length) {
    filters.tags.forEach(tag => queryParams.append('tag', tag));
  }
  queryParams.append('sortBy', sortBy);
  queryParams.append('page', page.toString());
  queryParams.append('pageSize', pageSize.toString());
  
  const { data, isLoading, isPreviousData, error } = useQuery<{
    products: Product[];
    totalProducts: number;
    totalPages: number;
  }>({ 
    queryKey: [`/api/products?${queryParams.toString()}`],
    keepPreviousData: true,
    retry: false,
  });
  
  console.log("Products query error:", error);
  
  const totalPages = data?.totalPages || 1;
  
  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [categoryId, searchQuery, filters, sortBy]);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-unbounded">
          {categoryId 
            ? data?.products?.[0]?.categoryName || 'Товары' 
            : searchQuery 
              ? `Поиск: ${searchQuery}` 
              : 'Все товары'
          }
        </h3>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">По новизне</SelectItem>
                <SelectItem value="popular">По популярности</SelectItem>
                <SelectItem value="availability">По наличию</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg overflow-hidden">
              <div className="w-full h-56 bg-secondary animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-6 bg-secondary rounded animate-pulse" />
                <div className="h-4 bg-secondary rounded animate-pulse" />
                <div className="h-4 bg-secondary rounded animate-pulse w-2/3" />
                <div className="h-10 bg-secondary rounded animate-pulse mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : data?.products && data.products.length > 0 ? (
        <>
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
          }>
            {data.products.map(product => (
              <ProductCard key={product.id} product={product} />
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
                const isCurrentPage = pageNumber === page;
                
                // Show current page, first, last, and pages around current
                if (
                  pageNumber === 1 || 
                  pageNumber === totalPages ||
                  (pageNumber >= page - 1 && pageNumber <= page + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink 
                        href="#" 
                        isActive={isCurrentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                // Show ellipsis for gaps
                if (
                  (pageNumber === 2 && page > 3) ||
                  (pageNumber === totalPages - 1 && page < totalPages - 2)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <span className="px-3 text-muted-foreground">...</span>
                    </PaginationItem>
                  );
                }
                
                return null;
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
          <p className="text-muted-foreground">Товары не найдены</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;

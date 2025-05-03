import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { ChevronRight } from 'lucide-react';
import { Category } from '@shared/schema';
import ProductFilters from './product-filters';

interface CategorySidebarProps {
  onFilterChange: (filters: {
    availability: boolean;
    storeIds: number[];
    tags: string[];
  }) => void;
}

const CategorySidebar = ({ onFilterChange }: CategorySidebarProps) => {
  const [location] = useLocation();
  const { data: categories, isLoading } = useQuery<Category[]>({ 
    queryKey: ['/api/categories']
  });
  
  const currentCategorySlug = location.split('/').pop();
  
  return (
    <div className="bg-card rounded-lg p-6">
      <h3 className="text-lg font-unbounded mb-4">Категории</h3>
      
      <ul className="space-y-3 mb-8">
        <li>
          <Link 
            href="/catalog"
            className={`category-item flex items-center ${!currentCategorySlug || currentCategorySlug === 'catalog' ? 'text-primary font-medium' : 'text-foreground'}`}
          >
            Все товары
            <ChevronRight className="ml-auto h-5 w-5" />
          </Link>
        </li>
        
        {isLoading ? (
          Array(8).fill(0).map((_, index) => (
            <li key={index} className="animate-pulse">
              <div className="h-6 bg-secondary rounded" />
            </li>
          ))
        ) : (
          categories?.map(category => (
            <li key={category.id}>
              <Link 
                href={`/catalog/${category.slug}`}
                className={`category-item flex items-center ${currentCategorySlug === category.slug ? 'text-primary font-medium' : 'text-foreground'}`}
              >
                {category.name}
                <ChevronRight className="ml-auto h-5 w-5" />
              </Link>
            </li>
          ))
        )}
      </ul>
      
      <ProductFilters onFilterChange={onFilterChange} />
    </div>
  );
};

export default CategorySidebar;

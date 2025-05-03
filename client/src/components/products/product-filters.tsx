import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { Store } from '@shared/schema';

interface ProductFiltersProps {
  onFilterChange: (filters: {
    availability: boolean;
    storeIds: number[];
    tags: string[];
  }) => void;
}

const ProductFilters = ({ onFilterChange }: ProductFiltersProps) => {
  const [availability, setAvailability] = useState(false);
  const [selectedStores, setSelectedStores] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const { data: stores } = useQuery<Store[]>({ 
    queryKey: ['/api/stores'],
  });
  
  const tags = ["Новинка", "Топ продаж", "Рекомендуем"];
  
  const handleAvailabilityChange = (checked: boolean) => {
    setAvailability(checked);
    onFilterChange({
      availability: checked,
      storeIds: selectedStores,
      tags: selectedTags
    });
  };
  
  const handleStoreChange = (storeId: number, checked: boolean) => {
    const newSelectedStores = checked
      ? [...selectedStores, storeId]
      : selectedStores.filter(id => id !== storeId);
    
    setSelectedStores(newSelectedStores);
    onFilterChange({
      availability,
      storeIds: newSelectedStores,
      tags: selectedTags
    });
  };
  
  const handleTagChange = (tag: string, checked: boolean) => {
    const newSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter(t => t !== tag);
    
    setSelectedTags(newSelectedTags);
    onFilterChange({
      availability,
      storeIds: selectedStores,
      tags: newSelectedTags
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-base mb-2">Наличие</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="availability" 
              checked={availability}
              onCheckedChange={(checked) => handleAvailabilityChange(checked as boolean)}
            />
            <Label htmlFor="availability">В наличии</Label>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-base mb-2">Магазин</h4>
        <div className="space-y-2">
          {stores?.map(store => (
            <div key={store.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`store-${store.id}`} 
                checked={selectedStores.includes(store.id)}
                onCheckedChange={(checked) => handleStoreChange(store.id, checked as boolean)}
              />
              <Label htmlFor={`store-${store.id}`}>{store.address}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-base mb-2">Тэги</h4>
        <div className="space-y-2">
          {tags.map(tag => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox 
                id={`tag-${tag}`}
                checked={selectedTags.includes(tag)}
                onCheckedChange={(checked) => handleTagChange(tag, checked as boolean)}
              />
              <Label htmlFor={`tag-${tag}`}>{tag}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;

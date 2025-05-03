import { Link } from 'wouter';
import { CheckCircle, XCircle } from 'lucide-react';
import { Product } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Функция для добавления стилей тега в зависимости от значения
  const getTagStyle = (tag: string) => {
    switch(tag) {
      case "Новинка":
        return "bg-primary";
      case "Топ продаж":
        return "bg-blue-600";
      case "Рекомендуем":
        return "bg-purple-600";
      default:
        return "bg-primary";
    }
  };
  
  // Статус наличия товара (если хотя бы в одном магазине есть)
  const isAvailableAnywhere = product.availability?.some(store => store.isAvailable) || false;
  
  return (
    <div className="product-card bg-card rounded-lg overflow-hidden transition-all hover:shadow-md">
      {/* Изображение и теги */}
      <div className="relative">
        <img 
          src={product.imageUrl}
          alt={product.name} 
          className="w-full h-48 md:h-56 object-cover"
          loading="lazy"
        />
        
        {/* Отображаем первый тег как большой, остальные как маленькие */}
        {product.tags.length > 0 && (
          <Badge 
            className={`absolute top-3 left-3 ${getTagStyle(product.tags[0])} text-white text-xs px-2 py-1 rounded-full`}
          >
            {product.tags[0]}
          </Badge>
        )}
        
        {/* Дополнительные теги (маленькие) */}
        {product.tags.length > 1 && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-background text-foreground text-xs px-2 py-1 rounded-full">
              +{product.tags.length - 1}
            </Badge>
          </div>
        )}
        
        {/* Индикатор наличия (внизу фото) */}
        <div className={`absolute bottom-0 left-0 right-0 py-1 px-3 text-xs text-white ${isAvailableAnywhere ? 'bg-green-600/80' : 'bg-red-600/80'}`}>
          {isAvailableAnywhere ? 'В наличии' : 'Нет в наличии'}
        </div>
      </div>
      
      {/* Информация о товаре */}
      <div className="p-4">
        <h3 className="font-unbounded text-base md:text-lg mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
        
        {/* Наличие в магазинах - только на больших экранах */}
        <div className="hidden md:block space-y-2 mb-4">
          {product.availability?.map((store) => (
            <div key={store.storeId} className="flex items-center text-sm">
              {store.isAvailable ? (
                <span className="text-green-500 mr-1"><CheckCircle size={16} /></span>
              ) : (
                <span className="text-red-500 mr-1"><XCircle size={16} /></span>
              )}
              <span className="truncate">
                {store.isAvailable ? 'В наличии' : 'Нет в наличии'} на {store.storeName}
              </span>
            </div>
          ))}
        </div>
        
        {/* Мобильная версия наличия (компактная) */}
        <div className="md:hidden flex space-x-2 mb-3">
          {product.availability?.slice(0, 2).map((store) => (
            <Badge 
              key={store.storeId} 
              variant={store.isAvailable ? "default" : "outline"}
              className={`
                text-[10px] py-0 px-2 
                ${store.isAvailable 
                  ? 'bg-green-600/20 text-green-600 hover:bg-green-600/30' 
                  : 'border-red-600/50 text-red-600'}
              `}
            >
              {store.storeName.split(' ').pop()}
            </Badge>
          ))}
          {product.availability && product.availability.length > 2 && (
            <Badge variant="outline" className="text-[10px] py-0 px-2">
              +{product.availability.length - 2}
            </Badge>
          )}
        </div>
        
        <Link href={`/product/${product.id}`}>
          <Button className="w-full bg-background text-foreground hover:bg-primary hover:text-white">
            Подробнее
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;

import { Link } from 'wouter';
import { CheckCircle, XCircle } from 'lucide-react';
import { Product } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="product-card bg-card rounded-lg overflow-hidden transition-all">
      <div className="relative">
        <img 
          src={product.imageUrl}
          alt={product.name} 
          className="w-full h-56 object-cover"
        />
        {product.tags.map((tag) => {
          let bgColor = "";
          
          switch(tag) {
            case "Новинка":
              bgColor = "bg-primary";
              break;
            case "Топ продаж":
              bgColor = "bg-blue-600";
              break;
            case "Рекомендуем":
              bgColor = "bg-purple-600";
              break;
            default:
              bgColor = "bg-primary";
          }
          
          return (
            <Badge 
              key={tag}
              className={`absolute top-3 left-3 ${bgColor} text-white text-xs px-2 py-1 rounded-full`}
            >
              {tag}
            </Badge>
          );
        })}
      </div>
      <div className="p-5">
        <h3 className="font-unbounded text-lg mb-2">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
        
        <div className="space-y-2 mb-4">
          {product.availability.map((store) => (
            <div key={store.storeId} className="flex items-center text-sm">
              {store.isAvailable ? (
                <span className="text-green-500 mr-1"><CheckCircle size={16} /></span>
              ) : (
                <span className="text-red-500 mr-1"><XCircle size={16} /></span>
              )}
              <span>
                {store.isAvailable ? 'В наличии' : 'Нет в наличии'} на {store.storeName}
              </span>
            </div>
          ))}
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

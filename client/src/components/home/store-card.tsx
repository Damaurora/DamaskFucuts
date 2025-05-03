import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { Store } from '@shared/schema';

interface StoreCardProps {
  store: Store;
}

// Функция для получения фото магазина на основе его ID
// В реальном приложении эти данные будут приходить с сервера
const getStoreImage = (storeId: number): string => {
  const storeImages: Record<number, string> = {
    1: "https://images.unsplash.com/photo-1600696690968-2573d9aecbee?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=600&q=80",
    2: "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=600&q=80",
    3: "https://images.unsplash.com/photo-1567958451986-2de427a4a0be?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=600&q=80",
    4: "https://images.unsplash.com/photo-1611930022073-84f5b060e2bf?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=600&q=80"
  };
  
  return storeImages[storeId] || "https://images.unsplash.com/photo-1581269515786-2cbb82f4c9d9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=600&q=80";
};

const StoreCard = ({ store }: StoreCardProps) => {
  const storeImage = getStoreImage(store.id);
  
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border/40">
      {/* Mobile layout - Card with image, prominent address */}
      <div className="md:hidden">
        <div className="h-32 relative overflow-hidden">
          <img 
            src={storeImage} 
            alt={store.name} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-3">
            <h3 className="font-unbounded text-base text-white drop-shadow-sm">{store.name}</h3>
          </div>
        </div>
        
        <div className="p-4 pt-3">
          {/* Address box with highlight */}
          <div className="bg-secondary/70 p-3 rounded-md mb-3">
            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-foreground font-medium text-sm">{store.address}</p>
            </div>
          </div>
          
          <div className="flex items-center mb-3 text-xs">
            <Clock className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
            <div className="text-muted-foreground">
              <p>{store.weekdayHours}</p>
              <p>{store.weekendHours}</p>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-1">
            <a 
              href={`tel:${store.phone.replace(/[^0-9+]/g, '')}`}
              className="text-xs bg-secondary text-foreground py-1.5 px-3 rounded-md flex items-center flex-1 justify-center"
            >
              <Phone className="h-3 w-3 mr-1" />
              Позвонить
            </a>
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
              target="_blank"
              rel="noopener noreferrer" 
              className="text-xs bg-primary/10 text-primary py-1.5 px-3 rounded-md flex items-center flex-1 justify-center"
            >
              <Navigation className="h-3 w-3 mr-1" />
              Маршрут
            </a>
          </div>
        </div>
      </div>
      
      {/* Desktop layout - Horizontal card with image */}
      <div className="hidden md:flex">
        {/* Изображение магазина */}
        <div className="w-2/5 relative overflow-hidden">
          <img 
            src={storeImage} 
            alt={store.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent">
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-md px-3 py-1.5 text-white">
              <p className="font-medium text-sm">DAMASK</p>
              <p className="text-xs opacity-80">Фирменный магазин</p>
            </div>
          </div>
        </div>
        
        {/* Информация */}
        <div className="w-3/5 p-6">
          <h3 className="font-unbounded text-xl mb-4">{store.name}</h3>
          
          {/* Address with highlight */}
          <div className="bg-secondary/70 p-3 rounded-md mb-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-foreground font-medium">{store.address}</p>
            </div>
          </div>
          
          <div className="space-y-3 text-muted-foreground">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-primary mr-3 mt-1" />
              <div>
                <p>{store.weekdayHours}</p>
                <p>{store.weekendHours}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-primary mr-3 mt-1" />
              <p>{store.phone}</p>
            </div>
          </div>
          
          <div className="flex space-x-4 mt-5">
            <a 
              href={`tel:${store.phone.replace(/[^0-9+]/g, '')}`}
              className="text-sm py-2 px-4 rounded-md flex items-center justify-center bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
            >
              <Phone className="h-4 w-4 mr-2" />
              Позвонить
            </a>
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
              target="_blank"
              rel="noopener noreferrer" 
              className="text-sm py-2 px-4 rounded-md flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Построить маршрут
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;

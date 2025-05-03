import { MapPin, Clock, Phone } from 'lucide-react';
import { Store } from '@shared/schema';

interface StoreCardProps {
  store: Store;
}

const StoreCard = ({ store }: StoreCardProps) => {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Mobile layout - Card with prominent address */}
      <div className="md:hidden">
        <div className="p-4">
          <h3 className="font-unbounded text-base mb-3">{store.name}</h3>
          
          {/* Address box with highlight */}
          <div className="bg-secondary/70 p-3 rounded-md mb-3">
            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-foreground font-medium text-sm">{store.address}</p>
            </div>
          </div>
          
          <div className="flex items-center mb-3">
            <Phone className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
            <p className="text-muted-foreground text-sm">{store.phone}</p>
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
              <MapPin className="h-3 w-3 mr-1" />
              Маршрут
            </a>
          </div>
        </div>
      </div>
      
      {/* Desktop layout - Vertical card with map */}
      <div className="hidden md:block">
        <div className="h-64 relative overflow-hidden">
          {/* Изображение магазина */}
          <img 
            src={`https://images.unsplash.com/photo-1581269515786-2cbb82f4c9d9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=600&q=80`} 
            alt={store.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col items-center justify-end p-4">
            <div className="bg-black/50 rounded-lg px-3 py-2 backdrop-blur-sm text-white text-center">
              <p className="font-medium">Damask Shop</p>
              <p className="text-xs">Фирменный магазин</p>
            </div>
          </div>
        </div>
        <div className="p-6">
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
          
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
            target="_blank"
            rel="noopener noreferrer" 
            className="inline-block mt-4 text-primary hover:text-primary/80 transition-all"
          >
            Построить маршрут
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 inline-block ml-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;

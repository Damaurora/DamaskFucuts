import { MapPin, Clock, Phone } from 'lucide-react';
import { Store } from '@shared/schema';

interface StoreCardProps {
  store: Store;
}

const StoreCard = ({ store }: StoreCardProps) => {
  return (
    <div className="bg-card rounded-lg overflow-hidden">
      <div className="h-64 relative">
        {/* Map placeholder - would be replaced with actual map component in production */}
        <div className="absolute inset-0 bg-secondary flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-10 w-10 mx-auto text-primary" />
            <p className="text-muted-foreground mt-2">Интерактивная карта</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-unbounded text-xl mb-4">{store.name}</h3>
        
        <div className="space-y-3 text-muted-foreground">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-primary mr-3 mt-1" />
            <p>{store.address}</p>
          </div>
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
  );
};

export default StoreCard;

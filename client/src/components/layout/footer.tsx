import { Link } from 'wouter';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card py-10 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-primary font-unbounded font-bold text-2xl">DAMASK</span>
              <span className="text-foreground font-unbounded text-xl">SHOP</span>
            </Link>
            <p className="text-muted-foreground">Магазин вейп продукции в Самаре. Широкий ассортимент, гарантия качества.</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-all" aria-label="Telegram">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M21.5 2L2 9.96537L9.96537 13.2182L13.2182 21.5L21.5 2Z"></path>
                  <path d="M9.96541 13.2182L13.0829 16.3357"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all" aria-label="VK">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M14 3C14 3 13.75 7 16 7C18.25 7 19 3 19 3H21L17 9L21 15H19C19 15 18.25 11 16 11C13.75 11 14 15 14 15H12V3H14Z"></path>
                  <path d="M5 15V9H3L7 3L11 9H9V15H5Z"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-unbounded mb-4">Информация</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-all">О нас</Link></li>
              <li><Link href="/delivery" className="hover:text-primary transition-all">Доставка</Link></li>
              <li><Link href="/payment" className="hover:text-primary transition-all">Оплата</Link></li>
              <li><Link href="/contacts" className="hover:text-primary transition-all">Контакты</Link></li>
              <li><Link href="/vacancies" className="hover:text-primary transition-all">Вакансии</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-unbounded mb-4">Каталог</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/catalog/pods" className="hover:text-primary transition-all">Поды</Link></li>
              <li><Link href="/catalog/liquids" className="hover:text-primary transition-all">Жидкости</Link></li>
              <li><Link href="/catalog/disposables" className="hover:text-primary transition-all">Одноразовые устройства</Link></li>
              <li><Link href="/catalog/hookahs" className="hover:text-primary transition-all">Кальяны</Link></li>
              <li><Link href="/catalog/tobacco" className="hover:text-primary transition-all">Табак</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-unbounded mb-4">Контакты</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <MapPin className="text-primary mt-1 mr-2 h-5 w-5" />
                <div>
                  <p>г. Самара, ул. Гагарина 32</p>
                  <p>г. Самара, ул. Победы 7</p>
                </div>
              </li>
              <li className="flex items-start">
                <Phone className="text-primary mt-1 mr-2 h-5 w-5" />
                <div>
                  <p>+7 (846) 123-45-67</p>
                  <p>+7 (846) 123-45-68</p>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="text-primary mt-1 mr-2 h-5 w-5" />
                <p>info@damaskshop.ru</p>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>© 2025 Damask Shop. Все права защищены.</p>
          <p className="mt-2">Сайт предназначен для лиц старше 18 лет. Информация о товарах носит ознакомительный характер.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

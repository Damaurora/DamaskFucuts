import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthContext } from '@/hooks/use-auth';
import { useContext } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { useMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const authContext = useContext(AuthContext);
  const user = authContext?.user || null;
  const isMobile = useMobile();
  const [, navigate] = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-primary font-unbounded font-bold text-2xl">DAMASK SHOP</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/catalog" className="nav-link">Каталог</Link>
            <Link href="/news" className="nav-link">Новости</Link>
            <Link href="/stores" className="nav-link">Магазины</Link>
            {user && (
              <Link href="/admin" className="nav-link">Админ</Link>
            )}
          </nav>
          
          {/* Search Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSearch}
              className="text-foreground hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </Button>
            {user && (
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Админ-панель
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu} 
            className="md:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-4">
              <div className="pb-2 border-b border-border">
                <form onSubmit={handleSearch} className="relative mt-3">
                  <Input
                    type="text"
                    placeholder="Поиск товаров..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-secondary text-foreground rounded-md pl-10"
                  />
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Button 
                    type="submit" 
                    variant="ghost" 
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pb-2">
                <Link href="/catalog" className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg hover:bg-primary/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-primary"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                  <span className="text-sm">Каталог</span>
                </Link>
                <Link href="/news" className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg hover:bg-primary/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-primary"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
                  <span className="text-sm">Новости</span>
                </Link>
                <Link href="/stores" className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg hover:bg-primary/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span className="text-sm">Магазины</span>
                </Link>
                {user && (
                  <Link href="/admin" className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg hover:bg-primary/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span className="text-sm">Админ</span>
                  </Link>
                )}
              </div>
              
              <div className="pt-3 border-t border-border">
                <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                  <Link href="/about" className="hover:text-primary transition-all">О нас</Link>
                  <Link href="/delivery" className="hover:text-primary transition-all">Доставка и оплата</Link>
                  <Link href="/contacts" className="hover:text-primary transition-all">Контакты</Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Search Bar (Hidden by default) */}
        {isSearchOpen && (
          <div className="py-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 px-4 bg-secondary text-foreground rounded-md"
                autoFocus
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleSearch}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon"
                  className="text-muted-foreground"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

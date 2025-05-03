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
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-primary font-unbounded font-bold text-2xl">DAMASK</span>
            <span className="text-foreground font-unbounded text-xl">SHOP</span>
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
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/catalog" className="nav-link">Каталог</Link>
              <Link href="/news" className="nav-link">Новости</Link>
              <Link href="/stores" className="nav-link">Магазины</Link>
              {user && (
                <Link href="/admin" className="nav-link">Админ</Link>
              )}
              <form onSubmit={handleSearch} className="relative mt-3">
                <Input
                  type="text"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary text-foreground rounded-md"
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
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

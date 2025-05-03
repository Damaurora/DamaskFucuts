import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Store, Newspaper, Grid, LogOut } from "lucide-react";

const AdminDashboard = () => {
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  
  const { data: stats } = useQuery<{
    productsCount: number;
    categoriesCount: number;
    newsCount: number;
    storesCount: number;
  }>({ 
    queryKey: ['/api/admin/stats']
  });
  
  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-unbounded">Панель администратора</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Выход
        </Button>
      </div>
      
      <p className="text-muted-foreground mb-8">
        Добро пожаловать, {user?.username}! Здесь вы можете управлять содержимым сайта.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex justify-between items-center">
              <span>Товары</span>
              <Package className="h-5 w-5 text-primary" />
            </CardTitle>
            <CardDescription>Управление товарами</CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-3xl font-bold">{stats?.productsCount || 0}</div>
            <p className="text-muted-foreground text-sm">Всего товаров</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/products">
              <Button className="w-full">
                Управление товарами
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex justify-between items-center">
              <span>Категории</span>
              <Grid className="h-5 w-5 text-primary" />
            </CardTitle>
            <CardDescription>Управление категориями</CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-3xl font-bold">{stats?.categoriesCount || 0}</div>
            <p className="text-muted-foreground text-sm">Всего категорий</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/categories">
              <Button className="w-full">
                Управление категориями
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex justify-between items-center">
              <span>Новости</span>
              <Newspaper className="h-5 w-5 text-primary" />
            </CardTitle>
            <CardDescription>Управление новостями</CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-3xl font-bold">{stats?.newsCount || 0}</div>
            <p className="text-muted-foreground text-sm">Всего публикаций</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/news">
              <Button className="w-full">
                Управление новостями
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex justify-between items-center">
              <span>Магазины</span>
              <Store className="h-5 w-5 text-primary" />
            </CardTitle>
            <CardDescription>Управление магазинами</CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-3xl font-bold">{stats?.storesCount || 0}</div>
            <p className="text-muted-foreground text-sm">Всего магазинов</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/stores">
              <Button className="w-full">
                Управление магазинами
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
          <CardDescription>Часто используемые функции</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/products/new">
              <Button variant="outline" className="w-full">
                Добавить новый товар
              </Button>
            </Link>
            <Link href="/admin/news/new">
              <Button variant="outline" className="w-full">
                Создать новость
              </Button>
            </Link>
            <Link href="/admin/categories/new">
              <Button variant="outline" className="w-full">
                Добавить категорию
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

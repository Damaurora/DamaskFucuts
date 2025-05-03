import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { CheckCircle, XCircle, ChevronRight, MessageCircle, Package } from 'lucide-react';
import { Product } from '@shared/schema';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductGrid from '@/components/products/product-grid';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: product, isLoading } = useQuery<Product>({ 
    queryKey: [`/api/products/${id}`]
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary w-1/4 rounded mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-secondary h-[400px] rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-10 bg-secondary w-3/4 rounded"></div>
              <div className="h-4 bg-secondary w-full rounded"></div>
              <div className="h-4 bg-secondary w-full rounded"></div>
              <div className="h-4 bg-secondary w-2/3 rounded"></div>
              <div className="space-y-2 mt-8">
                <div className="h-6 bg-secondary w-1/2 rounded"></div>
                <div className="h-6 bg-secondary w-1/2 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-unbounded mb-4">Товар не найден</h1>
        <p className="text-muted-foreground mb-6">Запрашиваемый товар не существует или был удален</p>
        <Link href="/catalog">
          <Button>Вернуться в каталог</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Главная</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/catalog">Каталог</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/catalog/${product.categorySlug}`}>
              {product.categoryName}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink>{product.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div>
          <div className="relative bg-card rounded-lg overflow-hidden">
            <img 
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto object-contain aspect-square"
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
                  className={`absolute top-4 left-4 ${bgColor} text-white px-3 py-1`}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>
          
          {/* Thumbnail images would go here */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[...Array(4)].map((_, index) => (
              <div 
                key={index}
                className={`cursor-pointer rounded-md overflow-hidden ${index === 0 ? 'ring-2 ring-primary' : ''}`}
              >
                <img 
                  src={product.imageUrl}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-auto object-cover aspect-square"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-unbounded mb-4">{product.name}</h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Наличие в магазинах</h2>
            <div className="space-y-2">
              {product.availability && product.availability.map((store) => (
                <div key={store.storeId} className="flex items-center">
                  {store.isAvailable ? (
                    <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
                  ) : (
                    <XCircle className="text-red-500 mr-2 h-5 w-5" />
                  )}
                  <span>
                    {store.isAvailable ? 'В наличии' : 'Нет в наличии'} на {store.storeName}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Описание</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{product.description}</p>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="specifications" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="specifications" className="text-primary-foreground">Характеристики</TabsTrigger>
              <TabsTrigger value="package" className="text-primary-foreground">Комплектация</TabsTrigger>
            </TabsList>
            <TabsContent value="specifications" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <dl className="grid grid-cols-2 gap-4">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className={index % 2 === 0 ? "bg-card/50 p-2 rounded" : "p-2"}>
                        <dt className="text-muted-foreground">{spec.name}:</dt>
                        <dd className="font-medium">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="package" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Package className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">В комплект поставки входит:</h3>
                  </div>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>1 шт. – {product.name}</li>
                    <li>1 шт. – Фирменная упаковка</li>
                    <li>1 шт. – Инструкция по эксплуатации</li>
                    {product.categoryId === 4 && (
                      <>
                        <li>1 шт. – Зарядный кабель USB Type-C</li>
                        <li>2 шт. – Сменная испарительная головка</li>
                      </>
                    )}
                    {product.categoryId === 6 && (
                      <>
                        <li>20 г – Содержимое продукта</li>
                        <li>1 шт. – Герметичная упаковка</li>
                      </>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <a 
              href={`https://t.me/NnDogwithoutsmth?text=Здравствуйте, а можно уточнить по поводу "${product.name}" в вашем магазине?`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button 
                className="w-full gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white text-base" 
                size="lg"
              >
                <MessageCircle className="h-5 w-5" />
                Уточнить у менеджера
              </Button>
            </a>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-unbounded mb-8">Похожие товары</h2>
        <ProductGrid categoryId={product.categoryId} />
      </div>
    </div>
  );
};

export default ProductPage;

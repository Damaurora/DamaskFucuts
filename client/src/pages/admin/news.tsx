import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { News } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { format } from "date-fns";

const newsSchema = z.object({
  title: z.string().min(3, "Заголовок должен содержать не менее 3 символов"),
  description: z.string().min(10, "Описание должно содержать не менее 10 символов"),
  content: z.string().min(20, "Содержание должно содержать не менее 20 символов"),
  imageUrl: z.string().url("Введите корректный URL изображения"),
  type: z.enum(["news", "promotion", "event"], {
    required_error: "Выберите тип публикации",
  }),
  isFeatured: z.boolean().default(false),
});

type NewsFormValues = z.infer<typeof newsSchema>;

const AdminNews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [currentTab, setCurrentTab] = useState<"all" | "news" | "promotion" | "event">("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  const { toast } = useToast();
  
  const { data, isLoading } = useQuery<{
    news: News[];
    totalNews: number;
    totalPages: number;
  }>({ 
    queryKey: [`/api/admin/news?type=${currentTab === 'all' ? '' : currentTab}&page=${page}&pageSize=${pageSize}`],
    keepPreviousData: true,
  });
  
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      imageUrl: "",
      type: "news",
      isFeatured: false,
    },
  });
  
  const openEditDialog = (newsItem: News) => {
    setEditingNews(newsItem);
    form.reset({
      title: newsItem.title,
      description: newsItem.description,
      content: newsItem.content,
      imageUrl: newsItem.imageUrl,
      type: newsItem.type as "news" | "promotion" | "event",
      isFeatured: newsItem.isFeatured,
    });
    setIsAddDialogOpen(true);
  };
  
  const openAddDialog = () => {
    setEditingNews(null);
    form.reset({
      title: "",
      description: "",
      content: "",
      imageUrl: "",
      type: "news",
      isFeatured: false,
    });
    setIsAddDialogOpen(true);
  };
  
  const onSubmit = async (data: NewsFormValues) => {
    try {
      if (editingNews) {
        await apiRequest("PATCH", `/api/admin/news/${editingNews.id}`, data);
        toast({
          title: "Успешно",
          description: "Новость обновлена",
        });
      } else {
        await apiRequest("POST", "/api/admin/news", data);
        toast({
          title: "Успешно",
          description: "Новость создана",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/admin/news'] });
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: editingNews 
          ? "Не удалось обновить новость" 
          : "Не удалось создать новость",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async (newsId: number) => {
    try {
      await apiRequest("DELETE", `/api/admin/news/${newsId}`);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/news'] });
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Успешно",
        description: "Новость удалена",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить новость",
        variant: "destructive",
      });
    }
  };
  
  const filteredNews = data?.news.filter(
    (newsItem) => newsItem.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <CardTitle className="text-2xl font-unbounded">Управление новостями</CardTitle>
            <CardDescription>Добавление, редактирование и удаление новостей и акций</CardDescription>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить публикацию
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Поиск новостей..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={currentTab}
              onValueChange={(value) => {
                setCurrentTab(value as "all" | "news" | "promotion" | "event");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Тип публикации" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="news">Новости</SelectItem>
                <SelectItem value="promotion">Акции</SelectItem>
                <SelectItem value="event">События</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-secondary rounded" />
              ))}
            </div>
          ) : (
            <>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">ID</TableHead>
                      <TableHead>Заголовок</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Дата публикации</TableHead>
                      <TableHead>В карусели</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNews.length > 0 ? (
                      filteredNews.map((newsItem) => (
                        <TableRow key={newsItem.id}>
                          <TableCell className="font-medium">{newsItem.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-md bg-secondary overflow-hidden">
                                <img 
                                  src={newsItem.imageUrl} 
                                  alt={newsItem.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <span className="font-medium">{newsItem.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={
                                newsItem.type === 'news' 
                                  ? 'border-primary text-primary' 
                                  : newsItem.type === 'promotion' 
                                    ? 'border-green-500 text-green-500' 
                                    : 'border-blue-500 text-blue-500'
                              }
                            >
                              {newsItem.type === 'news' ? 'Новость' : 
                               newsItem.type === 'promotion' ? 'Акция' : 'Событие'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(newsItem.publishDate), 'dd.MM.yyyy')}
                          </TableCell>
                          <TableCell>
                            {newsItem.isFeatured ? 
                              <Badge variant="default" className="bg-primary">Да</Badge> : 
                              <Badge variant="outline">Нет</Badge>
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openEditDialog(newsItem)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Редактировать</span>
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="icon" className="text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Удалить</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Подтверждение удаления</DialogTitle>
                                    <DialogDescription>
                                      Вы уверены, что хотите удалить публикацию "{newsItem.title}"? Это действие нельзя отменить.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleDelete(newsItem.id)}
                                    >
                                      Удалить
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          Публикации не найдены
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {data && data.totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) setPage(page - 1);
                        }}
                        className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {[...Array(data.totalPages)].map((_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink 
                            href="#" 
                            isActive={pageNumber === page}
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(pageNumber);
                            }}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < data.totalPages) setPage(page + 1);
                        }}
                        className={page >= data.totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{editingNews ? "Редактировать публикацию" : "Добавить публикацию"}</DialogTitle>
            <DialogDescription>
              {editingNews 
                ? "Внесите изменения в данные публикации"
                : "Заполните форму для создания новой публикации"
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Заголовок</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите заголовок" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тип публикации</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите тип" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="news">Новость</SelectItem>
                          <SelectItem value="promotion">Акция</SelectItem>
                          <SelectItem value="event">Событие</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Краткое описание</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите краткое описание" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Содержание</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Введите полное содержание публикации" 
                        className="min-h-[150px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL изображения</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Отображать в карусели</FormLabel>
                      <FormDescription>
                        Публикация будет показана в карусели на главной странице
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">
                  {editingNews ? "Сохранить изменения" : "Создать публикацию"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNews;

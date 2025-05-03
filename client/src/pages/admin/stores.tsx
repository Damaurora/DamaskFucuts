import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Store } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, MapPin, Phone, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const storeSchema = z.object({
  name: z.string().min(3, "Название должно содержать не менее 3 символов"),
  address: z.string().min(5, "Адрес должен содержать не менее 5 символов"),
  weekdayHours: z.string().min(3, "Введите часы работы в будни"),
  weekendHours: z.string().min(3, "Введите часы работы в выходные"),
  phone: z.string().min(5, "Телефон должен содержать не менее 5 символов"),
});

type StoreFormValues = z.infer<typeof storeSchema>;

const AdminStores = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  
  const { toast } = useToast();
  
  const { data: stores, isLoading } = useQuery<Store[]>({ 
    queryKey: ['/api/admin/stores'],
  });
  
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      address: "",
      weekdayHours: "Пн-Пт: 10:00 - 21:00",
      weekendHours: "Сб-Вс: 11:00 - 20:00",
      phone: "",
    },
  });
  
  const openEditDialog = (store: Store) => {
    setEditingStore(store);
    form.reset({
      name: store.name,
      address: store.address,
      weekdayHours: store.weekdayHours,
      weekendHours: store.weekendHours,
      phone: store.phone,
    });
    setIsAddDialogOpen(true);
  };
  
  const openAddDialog = () => {
    setEditingStore(null);
    form.reset({
      name: "",
      address: "",
      weekdayHours: "Пн-Пт: 10:00 - 21:00",
      weekendHours: "Сб-Вс: 11:00 - 20:00",
      phone: "",
    });
    setIsAddDialogOpen(true);
  };
  
  const onSubmit = async (data: StoreFormValues) => {
    try {
      if (editingStore) {
        await apiRequest("PATCH", `/api/admin/stores/${editingStore.id}`, data);
        toast({
          title: "Успешно",
          description: "Магазин обновлен",
        });
      } else {
        await apiRequest("POST", "/api/admin/stores", data);
        toast({
          title: "Успешно",
          description: "Магазин создан",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stores'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stores'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: editingStore 
          ? "Не удалось обновить магазин" 
          : "Не удалось создать магазин",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async (storeId: number) => {
    try {
      await apiRequest("DELETE", `/api/admin/stores/${storeId}`);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stores'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stores'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Успешно",
        description: "Магазин удален",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить магазин. Возможно, он связан с товарами.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <CardTitle className="text-2xl font-unbounded">Управление магазинами</CardTitle>
            <CardDescription>Добавление, редактирование и удаление информации о магазинах</CardDescription>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить магазин
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-secondary rounded" />
              ))}
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">ID</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Адрес</TableHead>
                    <TableHead>Часы работы</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stores && stores.length > 0 ? (
                    stores.map((store) => (
                      <TableRow key={store.id}>
                        <TableCell className="font-medium">{store.id}</TableCell>
                        <TableCell>{store.name}</TableCell>
                        <TableCell className="flex items-center">
                          <MapPin className="h-4 w-4 text-primary mr-2" />
                          {store.address}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                              {store.weekdayHours}
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                              {store.weekendHours}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="flex items-center">
                          <Phone className="h-4 w-4 text-primary mr-2" />
                          {store.phone}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openEditDialog(store)}
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
                                    Вы уверены, что хотите удалить магазин "{store.name}"? Это действие нельзя отменить.
                                    Внимание: удаление магазина может повлиять на информацию о наличии товаров.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(store.id)}
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
                        Магазины не найдены
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingStore ? "Редактировать магазин" : "Добавить магазин"}</DialogTitle>
            <DialogDescription>
              {editingStore 
                ? "Внесите изменения в данные магазина"
                : "Заполните форму для создания нового магазина"
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название магазина</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите название" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Адрес</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="г. Самара, ул. Примерная 123" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="weekdayHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Часы работы в будни</FormLabel>
                      <FormControl>
                        <Input placeholder="Пн-Пт: 10:00 - 21:00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="weekendHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Часы работы в выходные</FormLabel>
                      <FormControl>
                        <Input placeholder="Сб-Вс: 11:00 - 20:00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input placeholder="+7 (999) 123-45-67" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">
                  {editingStore ? "Сохранить изменения" : "Создать магазин"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStores;

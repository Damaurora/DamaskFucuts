import React, { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertOctagon } from 'lucide-react';

const AgeVerificationModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    // Проверяем, подтверждал ли уже пользователь свой возраст
    const hasVerified = localStorage.getItem('age-verified') === 'true';
    
    if (!hasVerified) {
      // Если нет, показываем модальное окно
      setShowModal(true);
    }
  }, []);
  
  const handleConfirm = () => {
    // Сохраняем информацию о подтверждении в localStorage
    localStorage.setItem('age-verified', 'true');
    setShowModal(false);
  };
  
  const handleDeny = () => {
    // Перенаправляем на другой сайт или показываем сообщение
    window.location.href = 'https://google.com';
  };
  
  return (
    <AlertDialog open={showModal} onOpenChange={setShowModal}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <AlertOctagon className="h-16 w-16 text-primary" />
          </div>
          <AlertDialogTitle className="text-center text-2xl font-unbounded">
            Подтверждение возраста
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            Вам должно быть 18 лет или больше, чтобы посетить этот сайт.
            <br />
            Продукция, представленная на сайте, содержит никотин, который вызывает зависимость.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button 
            variant="outline" 
            onClick={handleDeny}
            className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            Мне меньше 18 лет
          </Button>
          <Button 
            onClick={handleConfirm} 
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Мне 18 лет или больше
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AgeVerificationModal;
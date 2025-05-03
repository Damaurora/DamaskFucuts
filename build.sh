#!/bin/bash

# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Миграция базы данных
npm run db:push

# Заполнение базы данных начальными данными
npm run db:seed
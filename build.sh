#!/bin/bash

# Установка зависимостей, включая dev-зависимости для сборки
npm install --include=dev

# Сборка проекта
npm run build

# Миграция базы данных
npm run db:push

# Заполнение базы данных начальными данными
npm run db:seed
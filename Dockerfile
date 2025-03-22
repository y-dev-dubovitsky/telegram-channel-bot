# Используем официальный образ Node.js на основе Alpine (легковесный)
FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта, включая каталог src
COPY . .

# Компилируем TypeScript в JavaScript
RUN npm run build

# Удаляем devDependencies, так как они больше не нужны
RUN npm prune --production

# Используем новый образ для финальной сборки (мультистадийная сборка)
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем только необходимые файлы из стадии builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY .env ./

# Указываем порт, который будет использовать приложение
ENV PORT=3000
EXPOSE $PORT

# Команда для запуска приложения
CMD ["node", "dist/index.js"]
# Туристические Путевки - Серверное Приложение

Серверное приложение для управления туристическими путевками с использованием Express.js, PostgreSQL и Docker.

## Технологии

- **Express.js** - веб-фреймворк
- **PostgreSQL** - база данных
- **TypeScript** - типизированный JavaScript
- **Docker** - контейнеризация
- **Swagger/OpenAPI** - документация API
- **ООП** - объектно-ориентированное программирование
- **Паттерны**: MVC + 3 паттерна GoF (Singleton, Repository, Factory)

## Требования

- Node.js 20+
- Docker и Docker Compose
- npm или yarn

## Установка и запуск

### 1. Клонирование и установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# Application
NODE_ENV=development
HOST=127.0.0.1
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tour_packages_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_SCHEMA=public
DB_POOL_MIN=2
DB_POOL_MAX=10

# CORS
CORS_ORIGIN=*
CORS_CREDENTIALS=false
```

### 3. Запуск с Docker Compose

```bash
# Запуск всех сервисов (PostgreSQL + приложение)
npm run docker:up

# Просмотр логов
npm run docker:logs

# Остановка
npm run docker:down
```

### 4. Инициализация базы данных

После запуска PostgreSQL выполните миграции:

```bash
# Через Docker
docker exec -i tour_packages_postgres psql -U postgres -d tour_packages_db < database/migrations/001_initial_schema.sql

# Или локально
psql -U postgres -d tour_packages_db -f database/migrations/001_initial_schema.sql
```

### 5. Заполнение тестовыми данными

```bash
npm run seed
```

### 6. Запуск в режиме разработки

```bash
# Убедитесь, что PostgreSQL запущен локально
npm run dev
```

### 7. Сборка для production

```bash
npm run build
npm start
```

## Структура проекта

```
server/
├── src/
│   ├── api/              # API роуты
│   │   └── routes/       # Маршруты для различных ресурсов
│   ├── config/           # Конфигурация приложения
│   ├── controllers/      # Контроллеры (MVC)
│   ├── database/         # Подключение к БД (Singleton)
│   ├── factories/        # Фабрика данных (Factory Pattern)
│   ├── models/           # Модели данных (ООП)
│   ├── repositories/     # Репозитории (Repository Pattern)
│   ├── scripts/          # Скрипты (seed)
│   ├── services/         # Сервисный слой (бизнес-логика)
│   ├── app.ts            # Настройка Express приложения
│   └── server.ts         # Точка входа сервера
├── database/
│   ├── migrations/       # SQL миграции
│   └── init.sql          # Скрипт инициализации БД
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## Сущности приложения

### 1. **Destination** (Направление/Тип путевки)
**Описание:** Тип туристического направления для группировки и усреднения путевок

**Поля:**
- `id` - уникальный идентификатор
- `name` - название типа направления (например, "Пляжный отдых", "Горнолыжный курорт")
- `description` - описание типа направления

**Связи:**
- Имеет множество **TourPackage** (путевки этого типа)

**API:** `/api/destinations`

---

### 2. **TourPackage** (Туристическая путевка)
**Описание:** Информация о туристической путевке

**Поля:**
- `id` - уникальный идентификатор
- `destination` - куда (название места, например "Сочи", "Турция")
- `startDate` - когда (дата начала поездки)
- `duration` - длительность в днях
- `price` - стоимость путевки
- `transport` - транспорт (например, "Самолет", "Поезд")
- `accommodation` - проживание (например, "Отель 4*", "Апартаменты")
- `destinationTypeId` - ID типа направления (связь с Destination)

**Связи:**
- Принадлежит одному **Destination** (многие к одному)

**API:** `/api/tour-packages`

---

## Диаграмма связей сущностей

```
Destination (1) ──< (N) TourPackage
```

**Легенда:**
- `(1)` - один
- `(N)` - множество
- `──<` - направление связи (многие к одному)

## API Endpoints

### Направления (Destinations)
- `GET /api/destinations` - получить все направления
- `GET /api/destinations/:id` - получить направление по ID
- `POST /api/destinations` - создать новое направление
- `PUT /api/destinations/:id` - обновить направление
- `DELETE /api/destinations/:id` - удалить направление

### Туристические путевки (Tour Packages)
- `GET /api/tour-packages` - получить все путевки
- `GET /api/tour-packages/:id` - получить путевку по ID
- `GET /api/tour-packages/destination-type/:destinationTypeId` - получить путевки по типу направления
- `GET /api/tour-packages/destination-type/:destinationTypeId/average-price` - получить среднюю стоимость по типу направления
- `POST /api/tour-packages` - создать новую путевку
- `PUT /api/tour-packages/:id` - обновить путевку
- `DELETE /api/tour-packages/:id` - удалить путевку

## API Документация (Swagger/OpenAPI)

После запуска приложения документация API доступна по адресу:
- **Swagger UI**: http://localhost:3000/api-docs
- **OpenAPI JSON**: http://localhost:3000/api-docs.json

## Примеры использования

### Создание направления

```bash
POST /api/destinations
{
  "name": "Пляжный отдых",
  "description": "Отдых на морском побережье"
}
```

### Создание путевки

```bash
POST /api/tour-packages
{
  "destination": "Сочи",
  "startDate": "2024-07-01",
  "duration": 7,
  "price": 50000,
  "transport": "Самолет",
  "accommodation": "Отель 4*",
  "destinationTypeId": 1
}
```

### Получение средней стоимости по типу направления

```bash
GET /api/tour-packages/destination-type/1/average-price
```

## Архитектура и паттерны

### ООП (Объектно-ориентированное программирование)
- Все сущности представлены классами с наследованием от `BaseModel`
- Инкапсуляция данных и методов в классах
- Полиморфизм через базовые классы и интерфейсы

### Паттерн MVC (Model-View-Controller)
- **Models** (`src/models/`) - модели данных с бизнес-логикой
- **Views** - JSON представления через REST API
- **Controllers** (`src/controllers/`) - обработка HTTP запросов

### Паттерны GoF (Gang of Four)

1. **Singleton Pattern** (`src/database/DatabaseConnection.ts`)
   - Единственный экземпляр подключения к PostgreSQL
   - Обеспечивает централизованное управление пулом подключений

2. **Repository Pattern** (`src/repositories/`)
   - Абстракция доступа к данным через интерфейс `IRepository<T>`
   - Базовый класс `BaseRepository<T>` с общей функциональностью
   - Разделение логики работы с БД и бизнес-логики

3. **Factory Pattern** (`src/factories/DataFactory.ts`)
   - Генерация тестовых данных для заполнения базы данных
   - Централизованное создание объектов с различными параметрами

## Формат ответов API

### Успешный ответ
```json
{
  "success": true,
  "data": {
    "id": 1,
    "destination": "Сочи",
    "startDate": "2024-07-01",
    "duration": 7,
    "price": 50000,
    "transport": "Самолет",
    "accommodation": "Отель 4*",
    "destinationTypeId": 1
  }
}
```

### Ошибка
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

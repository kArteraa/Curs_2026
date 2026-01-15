# Туристические путевки - Frontend

Frontend приложение для управления туристическими путевками и направлениями, построенное на Next.js 14 с TypeScript, Tailwind CSS, TanStack Query, Axios и shadcn/ui.

## Технологии

- **Next.js 14** - React фреймворк с App Router
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **TanStack Query** - управление состоянием сервера
- **Axios** - HTTP клиент
- **shadcn/ui** - UI компоненты

## Установка

1. Установите зависимости:

```bash
npm install
```

2. Создайте файл `.env.local` в корне папки `front`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

3. Запустите dev сервер:

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3001](http://localhost:3001)

## Структура проекта

```
front/
├── app/                    # Next.js App Router
│   ├── destinations/       # Страница управления направлениями
│   ├── tour-packages/      # Страница управления путевками
│   ├── layout.tsx         # Главный layout
│   ├── page.tsx           # Главная страница
│   └── globals.css        # Глобальные стили
├── components/            # React компоненты
│   └── ui/                # shadcn/ui компоненты
├── lib/                   # Утилиты и конфигурация
│   ├── api/               # API клиенты
│   ├── hooks/             # React Query хуки
│   ├── types.ts           # TypeScript типы
│   └── utils.ts            # Утилиты
└── package.json
```

## Функциональность

### Направления (Destinations)

- ✅ Просмотр всех направлений
- ✅ Создание нового направления
- ✅ Редактирование направления
- ✅ Удаление направления

### Туристические путевки (Tour Packages)

- ✅ Просмотр всех путевок
- ✅ Создание новой путевки
- ✅ Редактирование путевки
- ✅ Удаление путевки
- ✅ Фильтрация путевок по типу направления
- ✅ Получение средней цены по типу направления

## API Эндпоинты

Все эндпоинты покрыты фронтендом:

### Destinations
- `GET /api/destinations` - получить все направления
- `GET /api/destinations/:id` - получить направление по ID
- `POST /api/destinations` - создать направление
- `PUT /api/destinations/:id` - обновить направление
- `DELETE /api/destinations/:id` - удалить направление

### Tour Packages
- `GET /api/tour-packages` - получить все путевки
- `GET /api/tour-packages/:id` - получить путевку по ID
- `GET /api/tour-packages/destination-type/:destinationTypeId` - получить путевки по типу направления
- `GET /api/tour-packages/destination-type/:destinationTypeId/average-price` - получить среднюю цену
- `POST /api/tour-packages` - создать путевку
- `PUT /api/tour-packages/:id` - обновить путевку
- `DELETE /api/tour-packages/:id` - удалить путевку

## Скрипты

- `npm run dev` - запуск dev сервера
- `npm run build` - сборка для production
- `npm run start` - запуск production сервера
- `npm run lint` - проверка кода линтером

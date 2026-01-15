# Руководство по выполнению миграций базы данных

## Проблема
Если вы получаете ошибку `отношение "destinations" не существует`, это означает, что таблицы в базе данных еще не созданы.

## Решение

### Вариант 1: Использование скрипта миграции (рекомендуется)

1. Убедитесь, что PostgreSQL запущен и доступен
2. Убедитесь, что база данных `tour_packages_db` создана
3. Выполните команду:

```bash
npm run migrate
```

### Вариант 2: Выполнение миграции через psql

Если у вас установлен PostgreSQL клиент, выполните:

```bash
# Windows (PowerShell)
psql -h localhost -p 5432 -U postgres -d tour_packages_db -f database\migrations\001_initial_schema.sql

# Linux/Mac
psql -h localhost -p 5432 -U postgres -d tour_packages_db -f database/migrations/001_initial_schema.sql
```

### Вариант 3: Выполнение через Docker

Если вы используете Docker Compose:

```bash
# Выполните миграцию внутри контейнера PostgreSQL
docker exec -i tour_packages_postgres psql -U postgres -d tour_packages_db < database/migrations/001_initial_schema.sql
```

### Вариант 4: Ручное выполнение SQL

1. Подключитесь к базе данных:
```bash
psql -h localhost -p 5432 -U postgres -d tour_packages_db
```

2. Скопируйте и выполните содержимое файла `database/migrations/001_initial_schema.sql`

## Проверка

После выполнения миграции проверьте, что таблицы созданы:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('destinations', 'tour_packages');
```

Должны быть видны обе таблицы: `destinations` и `tour_packages`.

## Заполнение тестовыми данными (опционально)

После выполнения миграций вы можете заполнить базу тестовыми данными:

```bash
npm run seed
```

## Переменные окружения

Убедитесь, что в файле `.env` указаны правильные параметры подключения:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tour_packages_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_SCHEMA=public
```

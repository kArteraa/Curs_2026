-- Создание таблиц для приложения туристических путевок

-- Направления/Типы путевок
CREATE TABLE IF NOT EXISTS destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Туристические путевки
CREATE TABLE IF NOT EXISTS tour_packages (
    id SERIAL PRIMARY KEY,
    destination VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    transport VARCHAR(100),
    accommodation VARCHAR(100),
    destination_type_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для улучшения производительности
CREATE INDEX IF NOT EXISTS idx_tour_packages_destination_type_id ON tour_packages(destination_type_id);
CREATE INDEX IF NOT EXISTS idx_tour_packages_start_date ON tour_packages(start_date);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tour_packages_updated_at BEFORE UPDATE ON tour_packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

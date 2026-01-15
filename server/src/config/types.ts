export interface AppConfig {
    host: string;
    port: number;
    env: string;
}

export interface DatabasePoolConfig {
    min: number;
    max: number;
}

export interface DatabaseConfig {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    schema: string;
    pool: DatabasePoolConfig;
}

export interface CorsConfig {
    origin: string;
    credentials: boolean;
}

export interface Config {
    app: AppConfig;
    database: DatabaseConfig;
    cors: CorsConfig;
}

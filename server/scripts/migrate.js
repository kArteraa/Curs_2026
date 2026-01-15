const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function runMigration() {
  console.log('Выполнение миграций базы данных...\n');

  const migrationFile = path.join(__dirname, '../database/migrations/001_initial_schema.sql');
  
  if (!fs.existsSync(migrationFile)) {
    console.error('Файл миграции не найден:', migrationFile);
    process.exit(1);
  }

  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || '5432';
  const dbName = process.env.DB_NAME || 'tour_packages_db';
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || 'postgres';

  console.log('Параметры подключения:');
  console.log(`  Host: ${dbHost}`);
  console.log(`  Port: ${dbPort}`);
  console.log(`  Database: ${dbName}`);
  console.log(`  User: ${dbUser}\n`);

  const answer = await question('Продолжить? (y/n): ');
  if (answer.toLowerCase() !== 'y') {
    console.log('Отменено.');
    rl.close();
    return;
  }

  // Читаем SQL файл
  const sql = fs.readFileSync(migrationFile, 'utf8');

  // Используем psql для выполнения миграции
  const command = `PGPASSWORD=${dbPassword} psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -c "${sql.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`;

  console.log('\nВыполнение миграции...\n');

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Ошибка выполнения миграции:', error.message);
      console.error('Попробуйте выполнить миграцию вручную:');
      console.error(`psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -f ${migrationFile}`);
      rl.close();
      process.exit(1);
    }

    if (stderr && !stderr.includes('NOTICE')) {
      console.error('Предупреждения:', stderr);
    }

    console.log('Миграция выполнена успешно!');
    console.log(stdout);
    rl.close();
  });
}

runMigration().catch(err => {
  console.error('Ошибка:', err);
  rl.close();
  process.exit(1);
});

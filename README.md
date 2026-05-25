# Backend Internet Shop

Серверна частина системи інтернет-магазину (REST API).

## Опис проєкту

Це backend-сервіс інтернет-магазину, реалізований у вигляді REST API.  
Проєкт забезпечує роботу з користувачами, каталогом товарів та кошиком.  
Основний функціонал включає реєстрацію, авторизацію, управління товарами та повноцінну роботу з кошиком.

## Технології

- **Node.js** + **TypeScript**
- **Express.js** — веб-фреймворк
- **TypeORM** + **SQLite** — робота з базою даних
- **tsyringe** — Dependency Injection
- **JWT** + **bcrypt** — автентифікація
- **Winston** — логування
- **Jest** — тестування
- **ESLint** + **Prettier** — код-стиль

## Структура проєкту

```
src/
├── __tests__/           # Модульні тести
├── config/              # Конфігурація (data-source.ts)
├── controllers/         # Контролери
├── dto/                 # Data Transfer Objects
├── entities/            # Сутності TypeORM
├── middleware/          # Middleware
├── services/            # Бізнес-логіка
├── utils/               # Допоміжні утиліти
├── app.ts               # Точка входу
├── container.ts         # Реєстрація залежностей
└── ...
```

## Встановлення та запуск

```bash
# 1. Клонувати репозиторій
git clone https://github.com/Maxxxxx98/backend-internet-shop.git

# 2. Перейти в папку проєкту
cd backend-internet-shop

# 3. Встановити залежності
npm install

# 4. Запустити в режимі розробки
npm run dev
```

Сервер буде доступний за адресою: `http://localhost:3000`

## Основні ендпоінти

**Публічні:**
- `POST /auth/register` — реєстрація користувача
- `POST /auth/login` — авторизація
- `GET /products` — отримати список товарів
- `POST /products` — створити товар

**Захищені (потрібен JWT-токен у заголовку `Authorization: Bearer <token>`):**
- `POST /cart` — додати товар до кошика
- `GET /cart` — отримати кошик
- `DELETE /cart` — видалити товар з кошика
- `GET /cart/total` — отримати загальну вартість кошика

## Тестування

```bash
npm test
npm run test:coverage
```

## Автор

Хвостенко Максим Віталійович, група КН-31

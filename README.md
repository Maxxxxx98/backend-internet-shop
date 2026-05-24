# Backend Internet Shop

Серверна частина системи інтернет-магазину (REST API).

## Технології

- Node.js + TypeScript
- Express.js
- TypeORM + SQLite
- tsyringe (Dependency Injection)
- JWT Authentication
- Winston (логування)
- ESLint + Prettier

## Основний функціонал

- Реєстрація та авторизація користувачів (JWT)
- Робота з товарами (створення, отримання списку)
- Робота з кошиком (додавання, видалення, розрахунок вартості)
- Захищені маршрути через middleware авторизації

## Структура проєкту
src/
├── controllers/          # Обробка HTTP-запитів
│   ├── AuthController.ts
│   ├── ProductController.ts
│   └── CartController.ts
├── services/             # Бізнес-логіка
│   ├── AuthService.ts
│   ├── ProductService.ts
│   └── CartService.ts
├── entities/             # TypeORM сутності
│   ├── User.ts
│   ├── Product.ts
│   ├── Cart.ts
│   └── CartItem.ts
├── middleware/           # Middleware
│   ├── authMiddleware.ts
│   └── errorHandler.ts
├── dto/                  # Data Transfer Objects
│   └── RegisterUserDto.ts
├── config/               # Конфігурація
│   └── data-source.ts
├── utils/                # Допоміжні утиліти
│   └── logger.ts
├── container.ts          # Реєстрація залежностей (tsyringe)
└── app.ts                # Точка входу застосунку

## Запуск проєкту

```bash
npm install
npm run dev
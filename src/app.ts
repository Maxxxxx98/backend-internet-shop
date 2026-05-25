import 'reflect-metadata';
import './container';
import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { AppDataSource } from './config/data-source';

import { AuthController } from './controllers/AuthController';
import { authMiddleware } from './middleware/authMiddleware';
import { ProductController } from './controllers/ProductController';
import { CartController } from './controllers/CartController';

/**
 * Головний файл застосунку — точка входу серверної частини інтернет-магазину.
 * 
 * Виконує:
 * - Завантаження змінних середовища
 * - Налаштування Express-сервера
 * - Підключення middleware
 * - Реєстрацію всіх маршрутів
 * - Ініціалізацію бази даних та запуск сервера
 */

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// ====================== MIDDLEWARE ======================

// Парсинг JSON та x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логування всіх вхідних HTTP-запитів
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// ====================== ROUTES ======================

// Публічні маршрути
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Server is running' });
});

// Auth routes
app.post('/auth/register', AuthController.register);
app.post('/auth/login', AuthController.login);

// Product routes
app.post('/products', ProductController.create);
app.get('/products', ProductController.getAll);

// Protected cart routes (вимагають авторизацію)
app.post('/cart', authMiddleware, CartController.addToCart);
app.get('/cart', authMiddleware, CartController.getCart);
app.delete('/cart', authMiddleware, CartController.removeFromCart);
app.get('/cart/total', authMiddleware, CartController.getCartTotal);

// Приклад захищеного маршруту
app.get('/profile', authMiddleware, (req: Request, res: Response) => {
  res.json({
    message: 'This is a protected route',
    user: req.user,
  });
});

// ====================== ERROR HANDLING ======================

// Глобальний обробник помилок (повинен бути останнім middleware)
app.use(errorHandler);

// ====================== SERVER START ======================

/**
 * Ініціалізація бази даних та запуск сервера
 */
AppDataSource.initialize()
  .then(() => {
    logger.info('Database connected successfully');
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('Error during Data Source initialization:', error);
  });

export { app };
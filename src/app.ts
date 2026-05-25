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

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логування запитів
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Роути
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Server is running' });
});

// Auth
app.post('/auth/register', AuthController.register);
app.post('/auth/login', AuthController.login);

// Products
app.post('/products', ProductController.create);
app.get('/products', ProductController.getAll);

// Cart (захищені роути)
app.post('/cart', authMiddleware, CartController.addToCart);
app.get('/cart', authMiddleware, CartController.getCart);
app.delete('/cart', authMiddleware, CartController.removeFromCart);
app.get('/cart/total', authMiddleware, CartController.getCartTotal);

// Захищений роут
app.get('/profile', authMiddleware, (req: Request, res: Response) => {
  res.json({
    message: 'This is a protected route',
    user: req.user,
  });
});

// Обробка помилок
app.use(errorHandler);

// Ініціалізація TypeORM
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
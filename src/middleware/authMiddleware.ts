import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

/**
 * Інтерфейс корисного навантаження (payload) JWT-токена
 */
interface JwtPayload {
  userId: string;
  email: string;
}

/**
 * Розширення типу Request з Express.
 * Додаємо поле `user`, щоб після успішної перевірки токена
 * у всіх захищених маршрутах був доступ до інформації про користувача.
 */
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

/**
 * Middleware авторизації.
 *
 * Перевіряє наявність та валідність JWT-токена в заголовку Authorization.
 * Якщо токен валідний — додає дані користувача в об'єкт `req.user`
 * і передає керування далі.
 * Якщо токен відсутній або невалідний — повертає помилку 401.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Перевірка наявності заголовка та правильного формату (Bearer ...)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Верифікація токена
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Зберігаємо дані користувача в запиті для подальших middleware та контролерів
    req.user = decoded;

    next(); // Передаємо керування далі
  } catch (error) {
    // Ігноруємо деталі помилки для безпеки (не розголошуємо інформацію про токен)
    void error;
    logger.error('Invalid token');
    return res.status(401).json({ message: 'Invalid token' });
  }
};
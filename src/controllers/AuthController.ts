import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AuthService } from '../services/AuthService';

/**
 * Контролер автентифікації користувачів (AuthController).
 *
 * Відповідає за обробку HTTP-запитів, пов’язаних з реєстрацією та входом у систему.
 * Всі методи є статичними і лише делегують виконання бізнес-логіки сервісу AuthService.
 */
export class AuthController {

  /**
   * Реєстрація нового користувача.
   *
   * @param req - запит з полями email та password
   * @param res - відповідь
   * @returns Об'єкт з повідомленням про успішну реєстрацію та userId
   */
  static async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const authService = container.resolve(AuthService);
      const result = await authService.register(email, password);

      return res.status(201).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(400).json({ message });
    }
  }

  /**
   * Авторизація (логін) користувача.
   *
   * @param req - запит з полями email та password
   * @param res - відповідь
   * @returns Об'єкт з повідомленням про успішний вхід та JWT-токеном
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const authService = container.resolve(AuthService);
      const result = await authService.login(email, password);

      return res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(401).json({ message });
    }
  }
}
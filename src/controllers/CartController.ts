import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CartService } from '../services/CartService';

/**
 * Контролер для роботи з кошиком користувача (CartController).
 *
 * Відповідає за обробку HTTP-запитів, пов’язаних з кошиком.
 * Всі методи делегують виконання бізнес-логіки сервісу CartService.
 * Захищені маршрути (вимагають авторизацію) отримують userId з req.user,
 * який встановлюється authMiddleware.
 */
export class CartController {

  /**
   * Додає товар до кошика авторизованого користувача.
   * Якщо товар вже є в кошику — збільшує його кількість.
   */
  static async addToCart(req: Request, res: Response) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user!.userId;

      const cartService = container.resolve(CartService);
      const result = await cartService.addToCart(userId, productId, quantity || 1);

      return res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(400).json({ message });
    }
  }

  /**
   * Видаляє товар з кошика авторизованого користувача.
   */
  static async removeFromCart(req: Request, res: Response) {
    try {
      const { productId } = req.body;
      const userId = req.user!.userId;

      const cartService = container.resolve(CartService);
      const result = await cartService.removeFromCart(userId, productId);

      return res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(400).json({ message });
    }
  }

  /**
   * Повертає поточний кошик авторизованого користувача
   * разом з усіма товарами та їх кількістю.
   */
  static async getCart(req: Request, res: Response) {
    const userId = req.user!.userId;

    const cartService = container.resolve(CartService);
    const cart = await cartService.getCart(userId);

    return res.json(cart);
  }

  /**
   * Повертає загальну вартість товарів у кошику
   * та кількість позицій (itemsCount).
   */
  static async getCartTotal(req: Request, res: Response) {
    const userId = req.user!.userId;

    const cartService = container.resolve(CartService);
    const total = await cartService.getCartTotal(userId);

    return res.json(total);
  }
}
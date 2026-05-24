import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CartService } from '../services/CartService';

export class CartController {
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

  static async getCart(req: Request, res: Response) {
    const userId = req.user!.userId;
    const cartService = container.resolve(CartService);
    const cart = await cartService.getCart(userId);
    return res.json(cart);
  }

  static async getCartTotal(req: Request, res: Response) {
    const userId = req.user!.userId;
    const cartService = container.resolve(CartService);
    const total = await cartService.getCartTotal(userId);
    return res.json(total);
  }
}

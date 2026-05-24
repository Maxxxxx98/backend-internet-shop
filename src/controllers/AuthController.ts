import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AuthService } from '../services/AuthService';

export class AuthController {
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

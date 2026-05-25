import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ProductService } from '../services/ProductService';

/**
 * Контролер управління товарами (ProductController).
 *
 * Відповідає за обробку HTTP-запитів, пов’язаних з каталогом товарів:
 * - створення нового товару
 * - отримання списку всіх товарів
 */
export class ProductController {

  /**
   * Створює новий товар у системі.
   *
   * @param req - запит, що містить дані товару (name, price, description, category, stock)
   * @param res - відповідь
   * @returns Збережений об'єкт товару зі статусом 201
   */
  static async create(req: Request, res: Response) {
    try {
      const productService = container.resolve(ProductService);
      const product = await productService.createProduct(req.body);

      return res.status(201).json(product);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(400).json({ message });
    }
  }

  /**
   * Повертає список усіх товарів, доступних у каталозі.
   *
   * @param req - запит
   * @param res - відповідь
   * @returns Масив об'єктів товарів
   */
  static async getAll(req: Request, res: Response) {
    const productService = container.resolve(ProductService);
    const products = await productService.getAllProducts();

    return res.json(products);
  }
}
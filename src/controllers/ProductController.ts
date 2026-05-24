import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ProductService } from '../services/ProductService';

export class ProductController {
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

  static async getAll(req: Request, res: Response) {
    const productService = container.resolve(ProductService);
    const products = await productService.getAllProducts();
    return res.json(products);
  }
}

import { injectable } from 'tsyringe';

import { AppDataSource } from '../config/data-source';
import { Product } from '../entities/Product';

/**
 * Сервіс управління товарами (ProductService).
 *
 * Відповідає за бізнес-логіку роботи з каталогом товарів:
 * - створення нових товарів
 * - отримання списку всіх товарів
 * - пошук товару за ID
 */
@injectable()
export class ProductService {
  private productRepository = AppDataSource.getRepository(Product);

  /**
   * Створює новий товар у базі даних.
   *
   * @param data - часткові дані товару (name, price, description, category, stock тощо)
   * @returns Збережений об'єкт товару з присвоєним ID
   */
  async createProduct(data: Partial<Product>) {
    const product = this.productRepository.create(data);
    return await this.productRepository.save(product);
  }

  /**
   * Повертає список усіх товарів з бази даних.
   *
   * @returns Масив усіх товарів
   */
  async getAllProducts() {
    return await this.productRepository.find();
  }

  /**
   * Знаходить товар за його унікальним ідентифікатором.
   *
   * @param id - UUID товару
   * @returns Об'єкт товару або null, якщо товар не знайдено
   */
  async getProductById(id: string) {
    return await this.productRepository.findOneBy({ id });
  }
}
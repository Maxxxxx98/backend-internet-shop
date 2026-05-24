import { injectable } from 'tsyringe';
import { AppDataSource } from '../config/data-source';
import { Product } from '../entities/Product';

@injectable()
export class ProductService {
  private productRepository = AppDataSource.getRepository(Product);

  async createProduct(data: Partial<Product>) {
    const product = this.productRepository.create(data);
    return await this.productRepository.save(product);
  }

  async getAllProducts() {
    return await this.productRepository.find();
  }

  async getProductById(id: string) {
    return await this.productRepository.findOneBy({ id });
  }
}

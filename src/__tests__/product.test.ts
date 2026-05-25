import 'reflect-metadata';
import { AppDataSource } from '../config/data-source';
import { ProductService } from '../services/ProductService';

describe('ProductService', () => {

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it('should create a new product', async () => {
    const productService = new ProductService();

    const productData = {
      name: `Test Product ${Date.now()}`,
      price: 999,
      stock: 10,
    };

    const product = await productService.createProduct(productData);

    expect(product).toHaveProperty('id');
    expect(product.name).toBe(productData.name);
    expect(Number(product.price)).toBe(productData.price);
    expect(product.stock).toBe(productData.stock);
  });

});
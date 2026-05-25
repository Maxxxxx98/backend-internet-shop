import 'reflect-metadata';
import { AppDataSource } from '../config/data-source';
import { CartService } from '../services/CartService';
import { ProductService } from '../services/ProductService';
import { AuthService } from '../services/AuthService';

describe('CartService', () => {
  let cartService: CartService;
  let productService: ProductService;
  let authService: AuthService;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    cartService = new CartService();
    productService = new ProductService();
    authService = new AuthService();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it('should add product to cart', async () => {
    // Створюємо користувача
    const email = `cartuser_${Date.now()}@example.com`;
    const user = await authService.register(email, '123456');
    const userId = user.userId;

    // Створюємо товар
    const product = await productService.createProduct({
      name: `Cart Test Product ${Date.now()}`,
      price: 150,
      stock: 5,
    });

    // Додаємо товар до кошика
    const result = await cartService.addToCart(userId, product.id, 2);

    expect(result).toHaveProperty('message', 'Product added to cart');

    // Перевіряємо, що товар додався
    const cart = await cartService.getCart(userId);
    expect(cart.items?.length).toBeGreaterThan(0);
  });

  it('should increase quantity when adding same product again', async () => {
    const email = `cartuser2_${Date.now()}@example.com`;
    const user = await authService.register(email, '123456');
    const userId = user.userId;

    const product = await productService.createProduct({
      name: `Cart Test Product 2 ${Date.now()}`,
      price: 200,
      stock: 10,
    });

    await cartService.addToCart(userId, product.id, 1);
    await cartService.addToCart(userId, product.id, 3); // додаємо ще раз

    const cart = await cartService.getCart(userId);
    const item = cart.items?.find((i) => i.product.id === product.id);

    expect(item?.quantity).toBe(4);
  });

  it('should calculate cart total correctly', async () => {
    const email = `cartuser3_${Date.now()}@example.com`;
    const user = await authService.register(email, '123456');
    const userId = user.userId;

    const product1 = await productService.createProduct({
      name: `Total Test 1 ${Date.now()}`,
      price: 100,
      stock: 5,
    });

    const product2 = await productService.createProduct({
      name: `Total Test 2 ${Date.now()}`,
      price: 250,
      stock: 3,
    });

    await cartService.addToCart(userId, product1.id, 2); // 200
    await cartService.addToCart(userId, product2.id, 1); // 250

    const total = await cartService.getCartTotal(userId);

    expect(total.total).toBe(450);
    expect(total.itemsCount).toBe(2);
  });
});
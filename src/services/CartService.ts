import { injectable } from 'tsyringe';

import { AppDataSource } from '../config/data-source';
import { Cart } from '../entities/Cart';
import { CartItem } from '../entities/CartItem';
import { Product } from '../entities/Product';

/**
 * Сервіс роботи з кошиком користувача.
 *
 * Відповідає за всю бізнес-логіку, пов’язану з кошиком:
 * - додавання товарів (з урахуванням збільшення кількості)
 * - видалення товарів
 * - отримання вмісту кошика
 * - розрахунок загальної вартості
 */
@injectable()
export class CartService {
  private cartRepository = AppDataSource.getRepository(Cart);
  private cartItemRepository = AppDataSource.getRepository(CartItem);
  private productRepository = AppDataSource.getRepository(Product);

  /**
   * Додає товар до кошика користувача.
   * Якщо кошик ще не існує — створює його.
   * Якщо товар вже є в кошику — збільшує його кількість.
   *
   * @param userId - ID користувача
   * @param productId - ID товару
   * @param quantity - кількість товару (за замовчуванням 1)
   * @returns Об'єкт з повідомленням про успішне додавання
   */
  async addToCart(userId: string, productId: string, quantity: number = 1) {
    // Отримуємо кошик користувача разом з товарами
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    // Якщо кошика немає — створюємо новий
    if (!cart) {
      cart = this.cartRepository.create();
      cart.user = { id: userId } as Cart['user'];
      await this.cartRepository.save(cart);
    }

    // Перевіряємо існування товару
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new Error('Product not found');
    }

    // Шукаємо, чи товар вже є в кошику
    let cartItem = cart.items?.find((item) => item.product.id === productId);

    if (cartItem) {
      // Якщо товар вже є — збільшуємо кількість
      cartItem.quantity += quantity;
      await this.cartItemRepository.save(cartItem);
    } else {
      // Якщо товару немає — створюємо новий запис
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return { message: 'Product added to cart' };
  }

  /**
   * Видаляє товар з кошика користувача.
   *
   * @param userId - ID користувача
   * @param productId - ID товару
   * @returns Об'єкт з повідомленням про успішне видалення
   */
  async removeFromCart(userId: string, productId: string) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart || !cart.items) {
      throw new Error('Cart not found');
    }

    const cartItem = cart.items.find((item) => item.product.id === productId);

    if (!cartItem) {
      throw new Error('Product not in cart');
    }

    await this.cartItemRepository.remove(cartItem);
    return { message: 'Product removed from cart' };
  }

  /**
   * Повертає поточний кошик користувача з усіма товарами.
   *
   * @param userId - ID користувача
   * @returns Кошик або порожній об'єкт, якщо кошик не знайдено
   */
  async getCart(userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    return cart || { items: [] };
  }

  /**
   * Обчислює загальну вартість товарів у кошику та кількість позицій.
   *
   * @param userId - ID користувача
   * @returns Об'єкт з total (вартість) та itemsCount (кількість позицій)
   */
  async getCartTotal(userId: string) {
    const cart = await this.getCart(userId);

    if (!cart.items || cart.items.length === 0) {
      return { total: 0, itemsCount: 0 };
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    return {
      total: Number(total.toFixed(2)),
      itemsCount: cart.items.length,
    };
  }
}
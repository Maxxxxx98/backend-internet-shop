import { injectable } from 'tsyringe';
import { AppDataSource } from '../config/data-source';
import { Cart } from '../entities/Cart';
import { CartItem } from '../entities/CartItem';
import { Product } from '../entities/Product';

@injectable()
export class CartService {
  private cartRepository = AppDataSource.getRepository(Cart);
  private cartItemRepository = AppDataSource.getRepository(CartItem);
  private productRepository = AppDataSource.getRepository(Product);

  async addToCart(userId: string, productId: string, quantity: number = 1) {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create();
      cart.user = { id: userId } as Cart['user'];
      await this.cartRepository.save(cart);
    }

    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new Error('Product not found');
    }

    let cartItem = cart.items?.find((item) => item.product.id === productId);

    if (cartItem) {
      cartItem.quantity += quantity;
      await this.cartItemRepository.save(cartItem);
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return { message: 'Product added to cart' };
  }

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

  async getCart(userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    return cart || { items: [] };
  }

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

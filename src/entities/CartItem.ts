import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Cart } from './Cart';
import { Product } from './Product';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart!: Cart;

  @ManyToOne(() => Product)
  product!: Product;

  @Column({ type: 'int', default: 1 })
  quantity!: number;
}

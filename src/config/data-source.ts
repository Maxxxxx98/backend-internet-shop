import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Product } from '../entities/Product';
import { Cart } from '../entities/Cart';
import { CartItem } from '../entities/CartItem';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_NAME || 'shop.db',
  synchronize: true,
  logging: false,
  entities: [User, Product, Cart, CartItem],
});

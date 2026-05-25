import { DataSource } from 'typeorm';

import { User } from '../entities/User';
import { Product } from '../entities/Product';
import { Cart } from '../entities/Cart';
import { CartItem } from '../entities/CartItem';

/**
 * Головна конфігурація підключення до бази даних.
 *
 * Використовується TypeORM для роботи з реляційною базою даних SQLite.
 * Цей файл створює та експортує єдиний екземпляр DataSource,
 * який використовується в усьому проєкті для доступу до даних.
 */
export const AppDataSource = new DataSource({
  /**
   * Тип бази даних — SQLite (вбудована, не потребує окремого сервера).
   * Ідеально підходить для розробки та навчальних проєктів.
   */
  type: 'sqlite',

  /**
   * Шлях до файлу бази даних.
   * Значення береться з .env (DB_NAME), за замовчуванням — shop.db
   */
  database: process.env.DB_NAME || 'shop.db',

  /**
   * Автоматична синхронізація схеми бази даних з сутностями.
   * Увімкнено для зручності розробки (в продакшені рекомендується вимкнути).
   */
  synchronize: true,

  /**
   * Логування SQL-запитів у консоль.
   * Вимкнено для чистоти логів під час звичайної роботи.
   */
  logging: false,

  /**
   * Список усіх сутностей (таблиць), які використовуються в проєкті.
   */
  entities: [User, Product, Cart, CartItem],
});
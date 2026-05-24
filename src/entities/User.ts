import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn } from 'typeorm';
import { Cart } from './Cart';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  cart!: Cart;
}

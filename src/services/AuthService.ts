import { injectable } from 'tsyringe';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

/**
 * Сервіс автентифікації користувачів.
 *
 * Відповідає за реєстрацію нових користувачів та їх авторизацію.
 * Використовує bcrypt для хешування паролів та jsonwebtoken для генерації JWT.
 */
@injectable()
export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Реєстрація нового користувача.
   *
   * @param email - email користувача (повинен бути унікальним)
   * @param password - пароль користувача
   * @returns Об'єкт з повідомленням про успішну реєстрацію та ID користувача
   * @throws Error - якщо користувач з таким email вже існує
   */
  async register(email: string, password: string) {
    const existingUser = await this.userRepository.findOneBy({ email });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = this.userRepository.create({ email, passwordHash });
    await this.userRepository.save(user);

    return { message: 'User registered successfully', userId: user.id };
  }

  /**
   * Авторизація користувача (логін).
   *
   * @param email - email користувача
   * @param password - пароль користувача
   * @returns Об'єкт з повідомленням про успішний вхід та JWT-токеном
   * @throws Error - якщо користувача не знайдено або пароль невірний
   */
  async login(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { message: 'Login successful', token };
  }
}
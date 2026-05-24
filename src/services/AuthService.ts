import { injectable } from 'tsyringe';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

@injectable()
export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

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

  async login(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return { message: 'Login successful', token };
  }
}

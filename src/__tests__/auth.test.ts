import 'reflect-metadata';
import { AppDataSource } from '../config/data-source';
import { AuthService } from '../services/AuthService';

describe('AuthService', () => {

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

  it('should register a new user', async () => {
    const authService = new AuthService();
    const uniqueEmail = `test_${Date.now()}@example.com`;

    const result = await authService.register(uniqueEmail, '123456');

    expect(result).toHaveProperty('message', 'User registered successfully');
    expect(result).toHaveProperty('userId');
  });

  it('should not register user with existing email', async () => {
    const authService = new AuthService();
    const email = `duplicate_${Date.now()}@example.com`;

    await authService.register(email, '123456');

    await expect(
      authService.register(email, '123456')
    ).rejects.toThrow('User already exists');
  });

  it('should login with valid credentials', async () => {
    const authService = new AuthService();
    const email = `login_${Date.now()}@example.com`;

    await authService.register(email, '123456');
    const result = await authService.login(email, '123456');

    expect(result).toHaveProperty('token');
  });

  it('should not login with wrong password', async () => {
    const authService = new AuthService();
    const email = `wrongpass_${Date.now()}@example.com`;

    await authService.register(email, '123456');

    await expect(
      authService.login(email, 'wrongpassword')
    ).rejects.toThrow('Invalid credentials');
  });

});
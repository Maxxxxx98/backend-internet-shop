import { container } from 'tsyringe';
import { AuthService } from './services/AuthService';
import { ProductService } from './services/ProductService';
import { CartService } from './services/CartService';

container.registerSingleton(AuthService);
container.registerSingleton(ProductService);
container.registerSingleton(CartService);

export { container };

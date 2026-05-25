import { container } from 'tsyringe';

import { AuthService } from './services/AuthService';
import { ProductService } from './services/ProductService';
import { CartService } from './services/CartService';

/**
 * Файл конфігурації Dependency Injection контейнера.
 *
 * Тут виконується реєстрація всіх сервісів та репозиторіїв у контейнері tsyringe.
 * Використовується режим Singleton, щоб у межах одного запуску сервера
 * створювався лише один екземпляр кожного сервісу.
 *
 * Це дозволяє:
 * - Уникнути створення дублюючих екземплярів
 * - Легко впроваджувати залежності через конструктор
 * - Спростити тестування (можна заміняти реалізації)
 */

container.registerSingleton(AuthService);
container.registerSingleton(ProductService);
container.registerSingleton(CartService);

/**
 * Експортуємо контейнер, щоб його можна було використовувати
 * у контролерах та інших частинах застосунку для отримання сервісів.
 */
export { container };
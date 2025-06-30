import './styles/global.css';
import { registerComponents } from '@/app/providers/handlebars';
import '../shared/lib/helpers/helpers';
import { routerProvider } from '@/app/providers';
import { AuthProvider } from '@/app/providers/auth-provider';

registerComponents();

document.addEventListener('DOMContentLoaded', async () => {
  routerProvider.start();
  await AuthProvider.initialize();
});

import './styles/global.css';
import { registerComponents } from '@/app/providers/handlebars';
import '../shared/lib/helpers/helpers';
import { routerProvider } from '@/app/providers';

registerComponents();

document.addEventListener('DOMContentLoaded', () => {
  routerProvider.start();
});

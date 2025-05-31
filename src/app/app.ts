import Block from '../shared/lib/block/block';
import './styles/global.css';
import PageSignIn from '../pages/sign-in/sign-in';
import PageNavigate from '../pages/navigate/navigate';
import Handlebars from 'handlebars';
import * as Components from '../shared/ui';
import * as Features from '../features';
import * as Widgets from '../widgets';

Object.entries(Components).forEach(([name, template]) =>
  Handlebars.registerPartial(name, template)
);
Object.entries(Features).forEach(([name, template]) =>
  Handlebars.registerPartial(name, template)
);
Object.entries(Widgets).forEach(([name, template]) =>
  Handlebars.registerPartial(name, template)
);

const pages: Record<string, Block> = {
  login: new PageSignIn(),
  nav: new PageNavigate()
};

const navigate = (page: string) => {
  const container = document.getElementById('app');
  const currentPage = pages[page];
  
  if (container && currentPage) {
    currentPage.dispatchComponentDidMount();
    container.innerHTML = '';
    container.append(currentPage.getContent());
  }
};

document.addEventListener('DOMContentLoaded', () => navigate('nav'));

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const page = target.closest('a')?.getAttribute('page');
  
  if (page) {
    navigate(page);
    e.preventDefault();
  }
});

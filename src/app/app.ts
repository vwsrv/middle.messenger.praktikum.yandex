import Handlebars from 'handlebars';
import './styles/global.css';
import * as Components from '../shared/ui';
import * as Features from '../features';
import * as Pages from '../pages';
import * as Widgets from '../widgets';
import { chats } from '../pages';

const pages = {
  login: [Pages.PageSignIn],
  signup: [Pages.PageSignUp],
  nav: [Pages.PageNavigate],
  notFound: [Pages.PageNotFoundError],
  serverError: [Pages.PageServerError],
  chats: [Pages.PageChats, { chats: chats }],
};

Object.entries(Components).forEach(([name, template]) => {
  Handlebars.registerPartial(name, template);
});

Object.entries(Features).forEach(([name, template]) => {
  Handlebars.registerPartial(name, template);
});

Object.entries(Widgets).forEach(([name, template]) => {
  Handlebars.registerPartial(name, template);
});

const navigate = (page: string) => {
  // @ts-ignore
  const [source, context] = pages[page];
  const container = document.getElementById('app');

  const templatingFunction = Handlebars.compile(source);
  // @ts-ignore
  container.innerHTML = templatingFunction(context);
};

document.addEventListener('DOMContentLoaded', () => navigate('chats'));

document.addEventListener('click', (e) => {
  //@ts-ignore
  const page = e.target.getAttribute('page');
  if (page) {
    navigate(page);

    e.preventDefault();
    e.stopImmediatePropagation();
  }
});

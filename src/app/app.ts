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
  chats: [
    Pages.PageChats,
    {
      chats: chats,
      activeChat: chats.find((chat) => chat.isActive),
    },
  ],
  emptyChats: [Pages.PageChats, { chats: chats }], // Явно передаем пустой массив
};

Object.entries(Components).forEach(([name, template]) => {
  Handlebars.registerPartial(name, template);
});

Object.entries(Features).forEach(([name, template]) => {
  Handlebars.registerPartial(name, template);
});

Object.entries(Widgets).forEach(([name, template]) => {
  Handlebars.registerPartial(name, template);
  console.log(name);
});

const navigate = (page: string) => {
  // @ts-ignore
  const [source, context] = pages[page];
  const container = document.getElementById('app');

  const templatingFunction = Handlebars.compile(source);
  // @ts-ignore
  container.innerHTML = templatingFunction(context);
};

document.addEventListener('DOMContentLoaded', () => navigate('nav'));

document.addEventListener('click', (e) => {
  //@ts-ignore
  const page = e.target.getAttribute('page');
  if (page) {
    navigate(page);

    e.preventDefault();
    e.stopImmediatePropagation();
  }
});

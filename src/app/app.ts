import './styles/global.css';
import Handlebars from 'handlebars';
import * as Features from '../features';
import * as Pages from '../pages';
import { renderDom } from '../shared/lib';
import * as Components from '../shared/ui';
import * as FeatureComponents from '../features';
import { UiBlockTemplate } from '../shared/ui/ui-block';
import { IPages, TNavigate } from './types';
import '../shared/lib/helpers/helpers';

const pages: IPages = {
  signUp: [Pages.SignUpPage, {}],
  signIn: [Pages.SignInPage, {}],
  changePassword: [Pages.ChangePasswordPage, {}],
  profileEdit: [Pages.ProfileEditPage, {}],
  chats: [Pages.PageChats, {}],
  nav: [Pages.PageNavigate, {}],
};

Object.entries(Components).forEach(([name, template]) => {
  if (typeof template === 'function') {
    return;
  }
  Handlebars.registerPartial(name, template);
});

Handlebars.registerPartial('UiBlock', UiBlockTemplate);

Object.entries(Features).forEach(([name, template]) => {
  if (typeof template === 'function') {
    return;
  }
  Handlebars.registerPartial(name, template);
});

Object.entries(FeatureComponents).forEach(([name, template]) => {
  if (typeof template === 'function') {
    return;
  }
  Handlebars.registerPartial(name, template);
});

const navigate: TNavigate = (page: string) => {
  const [source, context] = pages[page];
  if (typeof source === 'function') {
    renderDom({ query: '#app', block: new source({}) });
    return;
  }

  const container = document.getElementById('app');
  if (!container) {
    throw new Error('Root element #app not found');
  }

  const temlpatingFunction = Handlebars.compile(source as string);
  container.innerHTML = temlpatingFunction(context);
};

document.addEventListener('DOMContentLoaded', () => navigate('nav'));

document.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const page = target.getAttribute('data-page');

  if (page && !e.defaultPrevented) {
    navigate(page);
    e.preventDefault();
    e.stopImmediatePropagation();
  }
});

import * as Pages from '@/pages';

export const ROUTES_CONFIG = [
  {
    path: '/',
    component: Pages.SignInPage,
    meta: { public: true, name: 'auth.signin' },
  },
  {
    path: '/sign-up',
    component: Pages.SignUpPage,
    meta: { public: true, name: 'auth.signup' },
  },
  {
    path: '/messenger',
    component: Pages.MessengerPage,
    meta: { auth: true, name: 'chats.index' },
  },
  {
    path: '/settings',
    component: Pages.Settings,
    meta: { auth: true, name: 'profile.edit' },
  },
  {
    path: '/settings/password',
    component: Pages.SettingsPassword,
    meta: { auth: true, name: 'profile.password' },
  },
  {
    path: '*',
    component: Pages.NotFoundPage,
    meta: { public: true, name: 'errors.404' },
  },
];

import { JSDOM } from 'jsdom';

const jsdom = new JSDOM(`<body></body>`);

global.window = jsdom.window;
global.document = jsdom.window.document;
global.MouseEvent = jsdom.window.MouseEvent;
global.Node = jsdom.window.Node;

const storageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  length: 0,
  key: () => null,
};

Object.defineProperty(window, 'localStorage', {
  value: storageMock,
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: storageMock,
  writable: true,
});

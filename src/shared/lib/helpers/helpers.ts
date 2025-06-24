import Handlebars from 'handlebars';

Handlebars.registerHelper('eq', function (a: unknown, b: unknown): boolean {
  return a === b;
});

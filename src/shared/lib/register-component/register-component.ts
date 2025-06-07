import Handlebars from 'handlebars';
import { IRegisterComponentOptions, TComponentId } from './types';

export const registerComponent = ({ name, Component }: IRegisterComponentOptions): void => {
  if (name in Handlebars.helpers) {
    throw new Error(`Component "${name}" already registered`);
  }

  Handlebars.registerHelper(
    name,
    function (this: unknown, { hash }: { hash: Record<string, unknown> }) {
      const component = new Component(hash);
      return `<div data-id="${component._id as TComponentId}"></div>`;
    },
  );
};

import * as Features from '@/features';
import * as UIComponents from '@/shared/ui';
import Handlebars from 'handlebars';
import { UiBlockTemplate } from '@/shared/ui';

export const registerComponents = (): void => {
  Object.entries(UIComponents).forEach(([name, template]) => {
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

  Handlebars.registerHelper('renderComponent', function (component) {
    if (component && typeof component.render === 'function') {
      return component.render();
    }
    return '';
  });
};

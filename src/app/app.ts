import './styles/global.css';
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






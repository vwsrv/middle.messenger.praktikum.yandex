import Handlebars from "handlebars";
import * as Components from '../shared/ui';
import { renderDom } from "../shared/lib/render-dom/render-dom";
import { IPages,  TNavigate } from './types/types';

const pages: IPages = {
//todo
};

Object.entries(Components).forEach(([name, template]) => {
  if (typeof template === "function") {
    return;
  }
  Handlebars.registerPartial(name, template);
});

const navigate: TNavigate = (page: string) => {
  const [source, context] = pages[page];
  if (typeof source === "function") {
    renderDom({ query: '#app', block: new source({}) });
    return;
  }

  const container = document.getElementById("app");
  if (!container) {
    throw new Error('Root element #app not found');
  }

  const temlpatingFunction = Handlebars.compile(source as string);
  container.innerHTML = temlpatingFunction(context);
};

document.addEventListener("DOMContentLoaded", () => navigate("nav"));

document.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const page = target.getAttribute("data-page");
  
  if (page) {
    navigate(page);
    e.preventDefault();
    e.stopImmediatePropagation();
  }
});

import { IRenderDomOptions } from '@/shared/lib';

export const renderDom = ({ query, block }: IRenderDomOptions): void => {
  const root = document.querySelector(query);
  if (!root) {
    throw new Error(`Root element with selector "${query}" not found`);
  }

  root.innerHTML = '';
  root.appendChild(block.getContent()!);
};

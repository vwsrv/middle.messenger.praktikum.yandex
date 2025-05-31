import Block from '../../shared/lib/block/block';
import template from './navigate.hbs?raw';

export class PageNavigate extends Block {
    constructor() {
        super('div', {});
    }

    render() {
        return template;
    }
} 

export default PageNavigate;

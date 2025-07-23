import { expect } from 'chai';
import sinon from 'sinon';
import Block from './block';

class TestBlock extends Block {
  render(): string {
    return '<div>Test Block</div>';
  }
}

describe('Block', () => {
  let block: TestBlock;

  beforeEach(() => {
    block = new TestBlock();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Constructor', () => {
    it('should create block with default tagName', () => {
      expect(block.getContent()).to.be.instanceOf(window.HTMLElement);
      expect(block.getContent()?.tagName).to.equal('DIV');
    });

    it('should create block with custom tagName', () => {
      const customBlock = new TestBlock('span');
      expect(customBlock.getContent()?.tagName).to.equal('SPAN');
    });

    it('should have unique id', () => {
      const block1 = new TestBlock();
      const block2 = new TestBlock();
      expect((block1 as any)._id).to.not.equal((block2 as any)._id);
    });
  });

  describe('Props', () => {
    it('should set props correctly', () => {
      const props = { className: 'test-class', id: 'test-id' };
      const blockWithProps = new TestBlock('div', props);

      expect((blockWithProps as any).props.className).to.equal('test-class');
      expect((blockWithProps as any).props.id).to.equal('test-id');
    });

    it('should update props', () => {
      const blockWithProps = new TestBlock('div', { className: 'old-class' });
      blockWithProps.setProps({ className: 'new-class' });

      expect((blockWithProps as any).props.className).to.equal('new-class');
    });
  });

  describe('Element', () => {
    it('should return element', () => {
      expect(block.getContent()).to.be.instanceOf(window.HTMLElement);
    });

    it('should add className to element', () => {
      const blockWithClass = new TestBlock('div', { className: 'test-class' });
      expect(blockWithClass.getContent()?.classList.contains('test-class')).to.be.true;
    });

    it('should add attributes to element', () => {
      const blockWithAttrs = new TestBlock('div', {
        attrs: { 'data-test': 'value', id: 'test-id' },
      });

      expect(blockWithAttrs.getContent()?.getAttribute('data-test')).to.equal('value');
      expect(blockWithAttrs.getContent()?.getAttribute('id')).to.equal('test-id');
    });
  });

  describe('Show/Hide', () => {
    it('should show element', () => {
      block.hide();
      expect(block.getContent()?.style.display).to.equal('none');

      block.show();
      expect(block.getContent()?.style.display).to.equal('block');
    });

    it('should hide element', () => {
      block.show();
      expect(block.getContent()?.style.display).to.equal('block');

      block.hide();
      expect(block.getContent()?.style.display).to.equal('none');
    });
  });

  describe('Lifecycle', () => {
    it('should call componentDidMount', () => {
      const spy = sinon.spy(block, 'componentDidMount');
      block.dispatchComponentDidMount();
      expect(spy.calledOnce).to.be.true;
    });

    it('should call componentDidUpdate', () => {
      const spy = sinon.spy(block, 'componentDidUpdate');
      block.setProps({ test: 'value' });
      expect(spy.called).to.be.true;
    });
  });

  describe('Render', () => {
    it('should render template', () => {
      const rendered = block.render();
      expect(rendered).to.equal('<div>Test Block</div>');
    });

    it('should compile template to DOM', () => {
      const fragment = (block as any)._compile();
      expect(fragment).to.be.instanceOf(window.DocumentFragment);
    });
  });
});

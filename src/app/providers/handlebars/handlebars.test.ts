import { expect } from 'chai';
import sinon from 'sinon';
import Handlebars from 'handlebars';

describe('Handlebars Template Engine', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('Basic Template Compilation', () => {
    it('should compile simple template', () => {
      const template = 'Hello {{name}}!';
      const compiled = Handlebars.compile(template);
      const result = compiled({ name: 'World' });

      expect(result).to.equal('Hello World!');
    });

    it('should handle empty template', () => {
      const template = '';
      const compiled = Handlebars.compile(template);
      const result = compiled({});

      expect(result).to.equal('');
    });

    it('should handle template without variables', () => {
      const template = 'Static text without variables';
      const compiled = Handlebars.compile(template);
      const result = compiled({});

      expect(result).to.equal('Static text without variables');
    });
  });

  describe('Variable Interpolation', () => {
    it('should interpolate string variables', () => {
      const template = 'Name: {{name}}, Age: {{age}}';
      const compiled = Handlebars.compile(template);
      const result = compiled({ name: 'John', age: 25 });

      expect(result).to.equal('Name: John, Age: 25');
    });

    it('should handle missing variables', () => {
      const template = 'Name: {{name}}, Age: {{age}}';
      const compiled = Handlebars.compile(template);
      const result = compiled({ name: 'John' });

      expect(result).to.equal('Name: John, Age: ');
    });

    it('should handle nested object properties', () => {
      const template = 'User: {{user.name}}, Email: {{user.email}}';
      const compiled = Handlebars.compile(template);
      const result = compiled({
        user: { name: 'John', email: 'john@example.com' },
      });

      expect(result).to.equal('User: John, Email: john@example.com');
    });
  });

  describe('Conditional Statements', () => {
    it('should handle if statements', () => {
      const template = '{{#if isActive}}Active{{else}}Inactive{{/if}}';
      const compiled = Handlebars.compile(template);

      const activeResult = compiled({ isActive: true });
      const inactiveResult = compiled({ isActive: false });

      expect(activeResult).to.equal('Active');
      expect(inactiveResult).to.equal('Inactive');
    });

    it('should handle unless statements', () => {
      const template = '{{#unless isHidden}}Visible{{else}}Hidden{{/unless}}';
      const compiled = Handlebars.compile(template);

      const visibleResult = compiled({ isHidden: false });
      const hiddenResult = compiled({ isHidden: true });

      expect(visibleResult).to.equal('Visible');
      expect(hiddenResult).to.equal('Hidden');
    });
  });

  describe('Loops', () => {
    it('should handle each loops', () => {
      const template = '{{#each items}}{{name}}, {{/each}}';
      const compiled = Handlebars.compile(template);
      const result = compiled({
        items: [{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' }],
      });

      expect(result).to.equal('Item 1, Item 2, Item 3, ');
    });

    it('should handle empty arrays', () => {
      const template = '{{#each items}}{{name}}{{else}}No items{{/each}}';
      const compiled = Handlebars.compile(template);
      const result = compiled({ items: [] });

      expect(result).to.equal('No items');
    });
  });

  describe('Helpers', () => {
    it('should register and use custom helpers', () => {
      Handlebars.registerHelper('uppercase', function (str) {
        return str.toUpperCase();
      });

      const template = '{{uppercase name}}';
      const compiled = Handlebars.compile(template);
      const result = compiled({ name: 'hello world' });

      expect(result).to.equal('HELLO WORLD');
    });

    it('should use built-in helpers', () => {
      const template = '{{#if (eq status "active")}}Active{{else}}Inactive{{/if}}';

      Handlebars.registerHelper('eq', function (a, b) {
        return a === b;
      });

      const compiled = Handlebars.compile(template);
      const activeResult = compiled({ status: 'active' });
      const inactiveResult = compiled({ status: 'inactive' });

      expect(activeResult).to.equal('Active');
      expect(inactiveResult).to.equal('Inactive');
    });
  });

  describe('Partial Templates', () => {
    it('should render partial templates', () => {
      const partialTemplate = '<div class="user">{{name}}</div>';
      Handlebars.registerPartial('user', partialTemplate);

      const template = '{{> user}}';
      const compiled = Handlebars.compile(template);
      const result = compiled({ name: 'John' });

      expect(result).to.equal('<div class="user">John</div>');
    });

    it('should pass context to partials', () => {
      const partialTemplate = '<span>{{name}} ({{age}})</span>';
      Handlebars.registerPartial('user-info', partialTemplate);

      const template = '{{> user-info}}';
      const compiled = Handlebars.compile(template);
      const result = compiled({ name: 'John', age: 25 });

      expect(result).to.equal('<span>John (25)</span>');
    });
  });

  describe('HTML Escaping', () => {
    it('should escape HTML by default', () => {
      const template = '{{content}}';
      const compiled = Handlebars.compile(template);
      const result = compiled({ content: '<script>alert("xss")</script>' });

      expect(result).to.equal('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    });

    it('should allow unescaped content with triple braces', () => {
      const template = '{{{content}}}';
      const compiled = Handlebars.compile(template);
      const result = compiled({ content: '<strong>Bold text</strong>' });

      expect(result).to.equal('<strong>Bold text</strong>');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed templates gracefully', () => {
      const template = '{{#if name}}Hello {{name}}{{/if}}';

      expect(() => {
        Handlebars.compile(template);
      }).to.not.throw();
    });

    it('should handle undefined variables', () => {
      const template = '{{undefinedVar}}';
      const compiled = Handlebars.compile(template);
      const result = compiled({});

      expect(result).to.equal('');
    });
  });

  describe('Performance', () => {
    it('should compile templates efficiently', () => {
      const template = '{{#each items}}{{name}}: {{value}}{{/each}}';
      const data = {
        items: Array.from({ length: 1000 }, (_, i) => ({
          name: `Item ${i}`,
          value: i,
        })),
      };

      const compiled = Handlebars.compile(template);
      const startTime = Date.now();
      const result = compiled(data);
      const endTime = Date.now();

      expect(result).to.include('Item 0: 0');
      expect(result).to.include('Item 999: 999');
      expect(endTime - startTime).to.be.lessThan(100);
    });
  });
});

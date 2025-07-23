import { expect } from 'chai';
import sinon from 'sinon';
import HTTPTransport from '@/shared/lib/api/api';

describe('HTTPTransport', () => {
  let httpTransport: HTTPTransport;
  let xhrStub: sinon.SinonStub;

  beforeEach(() => {
    httpTransport = new HTTPTransport('https://api.test.com');

    xhrStub = sinon.stub();
    const xhrMock = {
      open: sinon.stub(),
      setRequestHeader: sinon.stub(),
      send: sinon.stub(),
      onload: null as any,
      onerror: null as any,
      status: 200,
      response: { success: true },
      responseText: '{"success": true}',
      responseType: 'json',
      withCredentials: false,
      timeout: 5000,
    };

    xhrStub.returns(xhrMock);
    (global as any).XMLHttpRequest = xhrStub;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Constructor', () => {
    it('should create instance with baseUrl', () => {
      const transport = new HTTPTransport('https://api.test.com');
      expect(transport).to.be.instanceOf(HTTPTransport);
    });

    it('should create instance without baseUrl', () => {
      const transport = new HTTPTransport();
      expect(transport).to.be.instanceOf(HTTPTransport);
    });
  });

  describe('GET requests', () => {
    it('should make GET request', async () => {
      const xhrMock = {
        open: sinon.stub(),
        setRequestHeader: sinon.stub(),
        send: sinon.stub(),
        onload: null as any,
        status: 200,
        response: { success: true },
        responseType: 'json',
        withCredentials: false,
        timeout: 5000,
      };

      xhrStub.returns(xhrMock);

      const promise = httpTransport.get('/users');

      xhrMock.onload();

      const result = await promise;
      expect(result).to.deep.equal({ success: true });
      expect(xhrMock.open.calledWith('GET', 'https://api.test.com/users')).to.be.true;
    });

    it('should handle query parameters', async () => {
      const xhrMock = {
        open: sinon.stub(),
        setRequestHeader: sinon.stub(),
        send: sinon.stub(),
        onload: null as any,
        status: 200,
        response: { success: true },
        responseType: 'json',
        withCredentials: false,
        timeout: 5000,
      };

      xhrStub.returns(xhrMock);

      const promise = httpTransport.get('/users', { data: { page: 1, limit: 10 } });

      xhrMock.onload();

      await promise;
      expect(xhrMock.open.calledWith('GET', 'https://api.test.com/users?page=1&limit=10')).to.be
        .true;
    });
  });

  describe('POST requests', () => {
    it('should make POST request', async () => {
      const xhrMock = {
        open: sinon.stub(),
        setRequestHeader: sinon.stub(),
        send: sinon.stub(),
        onload: null as any,
        status: 200,
        response: { success: true },
        responseType: 'json',
        withCredentials: false,
        timeout: 5000,
      };

      xhrStub.returns(xhrMock);

      const data = { name: 'test', email: 'test@test.com' };
      const promise = httpTransport.post('/users', { data });

      xhrMock.onload();

      const result = await promise;
      expect(result).to.deep.equal({ success: true });
      expect(xhrMock.open.calledWith('POST', 'https://api.test.com/users')).to.be.true;
      expect(xhrMock.send.calledWith(JSON.stringify(data))).to.be.true;
    });
  });

  describe('Error handling', () => {
    it('should handle 401 error', async () => {
      const xhrMock = {
        open: sinon.stub(),
        setRequestHeader: sinon.stub(),
        send: sinon.stub(),
        onload: null as any,
        status: 401,
        response: { error: 'Unauthorized' },
        responseType: 'json',
        withCredentials: false,
        timeout: 5000,
      };

      xhrStub.returns(xhrMock);

      const promise = httpTransport.get('/users');

      xhrMock.onload();

      try {
        await promise;
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.equal('Проверьте правильность ввода логина или пароля');
      }
    });

    it('should handle 404 error', async () => {
      const xhrMock = {
        open: sinon.stub(),
        setRequestHeader: sinon.stub(),
        send: sinon.stub(),
        onload: null as any,
        status: 404,
        response: { error: 'Not Found' },
        responseType: 'json',
        withCredentials: false,
        timeout: 5000,
      };

      xhrStub.returns(xhrMock);

      const promise = httpTransport.get('/users');

      xhrMock.onload();

      try {
        await promise;
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.equal('Не найдено.');
      }
    });

    it('should handle 500 error', async () => {
      const xhrMock = {
        open: sinon.stub(),
        setRequestHeader: sinon.stub(),
        send: sinon.stub(),
        onload: null as any,
        status: 500,
        response: { error: 'Internal Server Error' },
        responseType: 'json',
        withCredentials: false,
        timeout: 5000,
      };

      xhrStub.returns(xhrMock);

      const promise = httpTransport.get('/users');

      xhrMock.onload();

      try {
        await promise;
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.equal('Ошибка сервера.');
      }
    });
  });

  describe('Headers', () => {
    it('should set custom headers', async () => {
      const xhrMock = {
        open: sinon.stub(),
        setRequestHeader: sinon.stub(),
        send: sinon.stub(),
        onload: null as any,
        status: 200,
        response: { success: true },
        responseType: 'json',
        withCredentials: false,
        timeout: 5000,
      };

      xhrStub.returns(xhrMock);

      const headers = { Authorization: 'Bearer token', 'Custom-Header': 'value' };
      const promise = httpTransport.get('/users', { headers });

      xhrMock.onload();

      await promise;
      expect(xhrMock.setRequestHeader.calledWith('Authorization', 'Bearer token')).to.be.true;
      expect(xhrMock.setRequestHeader.calledWith('Custom-Header', 'value')).to.be.true;
    });
  });

  describe('FormData', () => {
    it('should handle FormData', async () => {
      const xhrMock = {
        open: sinon.stub(),
        setRequestHeader: sinon.stub(),
        send: sinon.stub(),
        onload: null as any,
        status: 200,
        response: { success: true },
        responseType: 'json',
        withCredentials: false,
        timeout: 5000,
      };

      xhrStub.returns(xhrMock);

      const formData = new FormData();
      formData.append('file', new Blob(['test']));

      const promise = httpTransport.post('/upload', { data: formData });

      xhrMock.onload();

      await promise;
      expect(xhrMock.send.calledWith(formData)).to.be.true;
    });
  });
});

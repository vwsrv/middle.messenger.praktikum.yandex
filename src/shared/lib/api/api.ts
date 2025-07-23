import { METHODS } from '@/shared/lib/api/constants';
import { TMethod, TQueryParams } from '@/shared/lib/api/models/types';
import { IRequestOptions } from '@/shared/lib/api/models/interfaces/request-options.interface';

class HTTPTransport {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private buildQueryString(params: TQueryParams): string {
    const validParams = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

    return validParams.length ? `?${validParams.join('&')}` : '';
  }

  private prepareBody(data: unknown): string | FormData | Blob | ArrayBuffer {
    if (data instanceof FormData || data instanceof Blob || data instanceof ArrayBuffer) {
      return data;
    }
    return JSON.stringify(data);
  }

  private getContentTypeHeader(data: unknown): string {
    if (data instanceof FormData) return '';
    if (data instanceof Blob) return data.type || 'application/octet-stream';
    return 'application/json;charset=UTF-8';
  }

  private request<D = any, R = any>(
    url: string,
    options: IRequestOptions<D> = {},
    timeout: number = 5000,
  ): Promise<R> {
    const {
      method = METHODS.GET,
      data,
      headers = {},
      withCredentials = false,
      responseType = 'json',
    } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;
      const queryString = isGet && data ? this.buildQueryString(data as TQueryParams) : '';
      const requestUrl = `${this.baseUrl}${url}${queryString}`;

      xhr.open(method, requestUrl);

      xhr.responseType = responseType;
      xhr.withCredentials = withCredentials;
      xhr.timeout = timeout;

      if (!(data instanceof FormData)) {
        const contentType = this.getContentTypeHeader(data);
        if (contentType) {
          xhr.setRequestHeader('Content-Type', contentType);
        }
      }

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            let response;
            if (responseType === 'json') {
              response = xhr.response;
            } else {
              response = xhr.responseText;
            }
            resolve(response);
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e}`));
          }
        } else {
          let errorMessage = `Request failed with status ${xhr.status}`;

          if (xhr.status === 401) {
            errorMessage = 'Проверьте правильность ввода логина или пароля';
          } else if (xhr.status === 403) {
            errorMessage = 'Для совершения действия требуется авторизация';
          } else if (xhr.status === 404) {
            errorMessage = 'Не найдено.';
          } else if (xhr.status === 400) {
            errorMessage = 'Что то не так, повторите попытку позже.';
          } else if (xhr.status === 500) {
            errorMessage = 'Ошибка сервера.';
          }

          console.error('HTTPTransport: Ошибка запроса:', errorMessage);
          reject(new Error(errorMessage));
        }
      };

      xhr.onerror = () => {
        console.error('HTTPTransport: Ошибка сети');
        reject(new Error('Network error'));
      };
      xhr.ontimeout = () => {
        console.error('HTTPTransport: Таймаут запроса');
        reject(new Error('Request timeout'));
      };
      xhr.onabort = () => {
        console.error('HTTPTransport: Запрос прерван');
        reject(new Error('Request aborted'));
      };

      try {
        if (isGet || !data) {
          xhr.send();
        } else {
          xhr.send(this.prepareBody(data));
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public get: TMethod = (url, options = {}) =>
    this.request(url, { ...options, method: METHODS.GET }, options.timeout);

  public put: TMethod = (url, options = {}) =>
    this.request(url, { ...options, method: METHODS.PUT }, options.timeout);

  public post: TMethod = (url, options = {}) =>
    this.request(url, { ...options, method: METHODS.POST }, options.timeout);

  public delete: TMethod = (url, options = {}) =>
    this.request(url, { ...options, method: METHODS.DELETE }, options.timeout);

  public patch: TMethod = (url, options = {}) =>
    this.request(url, { ...options, method: METHODS.PATCH }, options.timeout);

  public head: TMethod = (url, options = {}) =>
    this.request(url, { ...options, method: METHODS.HEAD }, options.timeout);

  public options: TMethod = (url, options = {}) =>
    this.request(url, { ...options, method: METHODS.OPTIONS }, options.timeout);
}

export const api = new HTTPTransport('https://ya-praktikum.tech/api/v2');

export default HTTPTransport;

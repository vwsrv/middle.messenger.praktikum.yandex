const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
} as const;

type HTTPMethod = (typeof METHODS)[keyof typeof METHODS];

interface HTTPHeaders {
  [key: string]: string;
}

interface RequestOptions<D = any> {
  headers?: HTTPHeaders;
  data?: D;
  timeout?: number;
  withCredentials?: boolean;
  responseType?: XMLHttpRequestResponseType;
}

interface FullRequestOptions<D = any> extends RequestOptions<D> {
  method?: HTTPMethod;
}

type QueryParams = Record<string, string | number | boolean | null | undefined>;

class HTTPTransport {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private buildQueryString(params: QueryParams): string {
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
    options: FullRequestOptions<D> = {},
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
      const queryString = isGet && data ? this.buildQueryString(data as QueryParams) : '';
      const requestUrl = `${this.baseUrl}${url}${queryString}`;

      xhr.open(method, requestUrl);

      xhr.responseType = responseType;
      xhr.withCredentials = withCredentials;
      xhr.timeout = timeout;

      // Set headers
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
            const response =
              responseType === 'json' && xhr.responseText
                ? JSON.parse(xhr.responseText)
                : xhr.response;
            resolve(response);
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e}`));
          }
        } else {
          reject(new Error(`Request failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));
      xhr.ontimeout = () => reject(new Error('Request timeout'));
      xhr.onabort = () => reject(new Error('Request aborted'));

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

  public get<R = any>(url: string, options: RequestOptions<QueryParams> = {}): Promise<R> {
    return this.request(url, { ...options, method: METHODS.GET });
  }

  public post<D = any, R = any>(url: string, options: RequestOptions<D> = {}): Promise<R> {
    return this.request<D, R>(url, { ...options, method: METHODS.POST });
  }

  public put<D = any, R = any>(url: string, options: RequestOptions<D> = {}): Promise<R> {
    return this.request<D, R>(url, { ...options, method: METHODS.PUT });
  }

  public delete<D = any, R = any>(url: string, options: RequestOptions<D> = {}): Promise<R> {
    return this.request<D, R>(url, { ...options, method: METHODS.DELETE });
  }

  public patch<D = any, R = any>(url: string, options: RequestOptions<D> = {}): Promise<R> {
    return this.request<D, R>(url, { ...options, method: METHODS.PATCH });
  }

  public head<R = any>(url: string, options: RequestOptions = {}): Promise<R> {
    return this.request(url, { ...options, method: METHODS.HEAD });
  }

  public options<R = any>(url: string, options: RequestOptions = {}): Promise<R> {
    return this.request(url, { ...options, method: METHODS.OPTIONS });
  }
}

export default HTTPTransport;

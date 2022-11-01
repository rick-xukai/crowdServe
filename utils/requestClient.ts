/* eslint-disable */
import axios from 'axios';

export const defaultHeaders = {
  'content-type': 'application/json',
  'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
};

const defaultOptions = {
  method: 'GET',
  headers: defaultHeaders,
};

/**
 * Construct URL based on provided URL and possible GET parameter.
 * @param baseUrl
 * @param params
 * @returns {string}
 */
export const constructUrlGetParameters = (baseUrl: string, params: any) => {
  const result = Object.keys(params).map((key) => {
    if (params[key]) {
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    }
  });

  const queryString = result.length ? `?${result.join('&')}` : '';
  return `${baseUrl}${queryString}`;
};

export class RequestClientClass {
  baseUrl: string | undefined;
  fetch: typeof axios;
  headers: any;
  payload: any;
  uri: string;
  queryUrl: any;
  requireHeadersReturn: boolean;
  responseType: string;

  constructor(baseUrl: string | undefined, fetch = axios) {
    this.baseUrl = baseUrl;
    this.fetch = fetch;
    this.headers = defaultOptions.headers;
    this.payload = '';
    this.uri = '';
    this.queryUrl = {};
    this.requireHeadersReturn = false;
    this.responseType = '';
  }

  /**
   * Trim up extra space, and leading slash
   * @param string
   */
  static clean(string: string | undefined) {
    if (typeof string === 'string') {
      return string.trim().replace(/\/$/, '');
    }
    return string;
  }

  setUri(uri: string) {
    this.uri = uri;
    return this;
  }

  setHeaders(headers: any) {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  setResponseType(type: string) {
    this.responseType = type;
    return this;
  }

  setPayload(payload: any) {
    this.payload = payload;
    return this;
  }

  /**
   * Set Get Parameter
   * @param {Object} queryUrl
   * @returns {HttpClient}
   */
  setQueryParameter(queryUrl: any) {
    if (typeof queryUrl === 'object') {
      Object.keys(queryUrl).forEach((key) => {
        this.setQueryParameterUrl(key, queryUrl[key]);
      });
    }
    return this;
  }

  setQueryParameterUrl(key: string, value: string) {
    this.queryUrl[key] = value;
    return this;
  }

  constructFQDN() {
    const uri = [this.baseUrl, this.uri]
      .map(RequestClientClass.clean)
      .filter(Boolean)
      .join('/');

    return constructUrlGetParameters(uri, this.queryUrl);
  }

  setRequireHeadersReturn(value: boolean) {
    this.requireHeadersReturn = value;
    return this;
  }

  async doMethod(method = 'GET') {
    const options: any = {
      baseURL: this.baseUrl,
      url: this.uri,
      ...defaultOptions,
      headers: {
        ...this.headers,
      },
      responseType: this.responseType,
      method,
    };

    if (method === 'GET') {
      options.params = this.queryUrl;
    }

    if (
      method === 'POST' ||
      method === 'PUT' ||
      method === 'DELETE' ||
      method === 'PATCH'
    ) {
      options.data = this.payload;
    }

    const response = await this.fetch(options);
    const finalResponse = response.data;
    if (this.requireHeadersReturn) {
      const finalHeaders = {
        ...response.headers,
        ...finalResponse.headers,
      };
      finalResponse.headers = finalHeaders;
    }
    return finalResponse;
  }

  doPost() {
    return this.doMethod('POST');
  }

  doPut() {
    return this.doMethod('PUT');
  }

  doGet() {
    return this.doMethod('GET');
  }

  doDelete() {
    return this.doMethod('DELETE');
  }

  doPatch() {
    return this.doMethod('PATCH');
  }

}

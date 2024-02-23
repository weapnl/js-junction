import Response from './response';
import axios from 'axios';

export default class Connection {
    constructor () {
        this._abortController = null;

        this._config = {};
        this._api = null;

        this.running = false;
        this.canceled = false;
        this.failed = false;
    }

    cancel () {
        if (! this._abortController || ! this.running) return this;

        this._abortController.abort();

        this.canceled = true;
    }

    cancelRunning (request) {
        this._api.cancelRunning(request);
    }

    setConfig (config) {
        this._config = config;
    }

    setApi (api) {
        this._api = api;
    }

    async get (query, params) {
        return this._execute(query, 'get', params);
    }

    async post (query, data) {
        return this._execute(query, 'post', data);
    }

    async put (query, params) {
        return this._execute(query, 'put', params);
    }

    async delete (query) {
        return this._execute(query, 'delete');
    }

    async _execute (url, method, data) {
        this.running = true;

        if (! _.startsWith(url, '/')) {
            url = `/${url}`;
        }

        const config = {
            url: (this._api ? this._api.baseUrl : api.baseUrl) + url,
            method,
            ...({
                [method === 'get' ? 'params' : 'data']: data,
            }),
            signal: (this._abortController = new AbortController()).signal,
        };

        const request = axios(Object.assign(config, this._config));
        const response = new Response();

        await request
            .then((axiosResponse) => {
                response.set(axiosResponse.status, axiosResponse);
            })
            .catch((error) => {
                this.failed = true;

                let statusCode = 0;

                if (error.response) {
                    statusCode = error.response.status;
                }

                response.set(statusCode, error);
            })
            .finally(() => {
                this.running = false;
            });

        return response;
    }
}

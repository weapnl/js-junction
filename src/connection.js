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

    removeRequest (request) {
        this._api.removeRequest(request);
    }

    getConfig () {
        return this._config;
    }

    getChunkUploadSize () {
        return this._api?._chunkUploadSize ?? null;
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

    async put (query, data) {
        return this._execute(query, 'put', data);
    }

    async delete (query, data) {
        return this._execute(query, 'delete', data);
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
                response.setAxiosResponse(axiosResponse);
            })
            .catch((axiosError) => {
                this.failed = true;

                response.setAxiosError(axiosError);
            })
            .finally(() => {
                this.running = false;
            });

        return response;
    }
}

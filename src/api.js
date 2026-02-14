import Request from './request';
import Batch from './batch';
import axios from 'axios';

import responseEventsMixin from './mixins/responseEventsMixin';

/**
 * @mixes responseEventsMixin
 */
export default class Api {
    constructor () {
        this.setHeader('X-Requested-With', 'XMLHttpRequest');

        this._requests = [];
        this._maxUploadSize = null;

        this.host('/').suffix('');

        this._initResponseEvents();
    }

    /**
     * @param {string} host
     *
     * @returns {this} The current instance.
     */
    host (host) {
        this._host = host;

        return this;
    }

    /**
     * Set the maximum upload size in bytes per request.
     * When set, file uploads will be chunked into multiple requests
     * so that no single request exceeds this limit.
     *
     * @param {number} bytes
     *
     * @returns {this} The current instance.
     */
    maxUploadSize (bytes) {
        this._maxUploadSize = bytes;

        return this;
    }

    /**
     * @param {string} suffix
     *
     * @returns {this} The current instance.
     */
    suffix (suffix) {
        if (! _.startsWith(suffix, '/') && suffix) {
            suffix = `/${suffix}`;
        }

        this._suffix = suffix;

        return this;
    }

    /**
     * @returns {string} Url containing the host and suffix.
     */
    get baseUrl () {
        let url = '';

        if (this._host) url += this._host;
        if (this._suffix) url += this._suffix;

        return url;
    }

    /**
     * @param {Request} request
     */
    cancelRunning (request) {
        if (! request.key) {
            return;
        }

        this._requests[request.key]?.cancel();
        this._requests[request.key] = request;
    }

    /**
     * @param {Request} request
     */
    removeRequest (request) {
        if (! request.key) {
            return;
        }

        if (request.response.isFinished) {
            delete this._requests[request.key];
        }
    }

    /**
     * @param {string} uri
     *
     * @returns {Request} The created request.
     */
    request (uri) {
        if (! uri) throw new Error(`Request url is empty.`);

        if (! _.startsWith(uri, '/')) {
            uri = `/${uri}`;
        }

        const request = new Request();

        request
            .setUrl(uri)
            .setApi(this);

        return request;
    }

    /**
     * @returns {this} The current instance.
     */
    cancelRequests () {
        this._requests.forEach((request) => {
            request.cancel();
        });

        this._requests = [];

        return this;
    }

    /**
     * @param {array} requests
     * @returns Batch
     */
    batch (requests) {
        return new Batch(requests);
    }

    /**
     * @param {string} token
     */
    setBearer (token) {
        this.setHeader('Authorization', 'Bearer ' + token);
    }

    resetBearer () {
        this.removeHeader('Authorization');
    }

    /**
     * @param {string} token
     */
    setCsrf (token) {
        this.setHeader('X-CSRF-TOKEN', token);
    }

    resetCsrf () {
        this.removeHeader('X-CSRF-TOKEN');
    }

    /**
     * @param {string} key
     * @param {string} value
     */
    setHeader (key, value) {
        axios.defaults.headers.common[key] = value;
    }

    /**
     * @param {string} key
     */
    removeHeader (key) {
        delete axios.defaults.headers.common[key];
    }

    /**
     * @param {function(Response)} onSuccess
     * @param {function(Error)} onError
     *
     * @returns {this}
     */
    responseInterceptors (onSuccess = () => {}, onError = () => {}) {
        axios.interceptors.response.use((response) => {
            onSuccess(response);

            return response;
        }, (error) => {
            onError(error);

            return Promise.reject(error);
        });

        return this;
    }
}

Object.assign(Api.prototype, responseEventsMixin);

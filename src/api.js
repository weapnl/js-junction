import Request from './request';
import Batch from './batch';
import axios from 'axios';

export default class Api {
    constructor () {
        this.setHeader('X-Requested-With', 'XMLHttpRequest');

        this._requests = [];

        this.host('/').suffix('');

        this._onSuccess = () => {};
        this._onError = () => {};
        this._onValidationError = () => {};
        this._onUnauthorized = () => {};
        this._onForbidden = () => {};
        this._onFinished = () => {};
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

    cancelRunning (request) {
        if (! request.key && ! request.classInstance) {
            return;
        }

        const identifier = {
            key: request.key,
            classInstance: request.classInstance,
        };

        _.find(this._requests, identifier)?.cancel();
        _.remove(this._requests, identifier);

        this._requests.push(request);
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

        request.setUrl(uri)
            .setApi(this)
            .onSuccess(this._onSuccess)
            .onError(this._onError)
            .onValidationError(this._onValidationError)
            .onUnauthorized(this._onUnauthorized)
            .onForbidden(this._onForbidden)
            .onFinished(this._onFinished);

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
     * Set the default 'onSuccess'. Can be overridden in the Request class.
     *
     * @param {function(Response.data)} callback
     *
     * @returns {this} The current instance.
     */
    onSuccess (callback = () => {}) {
        this._onSuccess = callback;

        return this;
    }

    /**
     * Set the default 'onError'. Can be overridden in the Request class.
     *
     * @param {function(Response)} callback
     *
     * @returns {this} The current instance.
     */
    onError (callback = () => {}) {
        this._onError = callback;

        return this;
    }

    /**
     * Set the default 'onValidationError'. Can be overridden in the Request class.
     *
     * @param {function(Response.validation)} callback
     *
     * @returns {this} The current instance.
     */
    onValidationError (callback = () => {}) {
        this._onValidationError = callback;

        return this;
    }

    /**
     * Set the default 'onUnauthorized'. Can be overridden in the Request class.
     *
     * @param {function(Response)} callback
     *
     * @returns {this} The current instance.
     */
    onUnauthorized (callback = () => {}) {
        this._onUnauthorized = callback;

        return this;
    }

    /**
     * Set the default 'onForbidden'. Can be overridden in the Request class.
     *
     * @param {function(Response)} callback
     *
     * @returns {this} The current instance.
     */
    onForbidden (callback = () => {}) {
        this._onForbidden = callback;

        return this;
    }

    /**
     * Set the default 'onFinished'. Can be overridden in the Request class.
     *
     * @param {function(Response)} callback
     *
     * @returns {this} The current instance.
     */
    onFinished (callback = () => {}) {
        this._onFinished = callback;

        return this;
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

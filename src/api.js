import Request from './request';
import Batch from './batch';
import axios from 'axios';

export default class Api {
    constructor () {
        this.setHeader('X-Requested-With', 'XMLHttpRequest');

        this._requests = [];

        this.host('/').suffix('');

        this._onSuccess = null;
        this._onError = null;
        this._onValidationError = null;
        this._onUnauthorized = null;
        this._onForbidden = null;
        this._onFinished = null;
        this._onCancelled = null;
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

        request.setUrl(uri)
            .setApi(this);

        if (this._onSuccess) request.onSuccess(this._onSuccess);
        if (this._onError) request.onError(this._onError);
        if (this._onValidationError) request.onValidationError(this._onValidationError);
        if (this._onUnauthorized) request.onUnauthorized(this._onUnauthorized);
        if (this._onForbidden) request.onForbidden(this._onForbidden);
        if (this._onFinished) request.onFinished(this._onFinished);
        if (this._onCancelled) request.onCancelled(this._onCancelled);

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
     * Set the default 'onSuccess' event handler.
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
     * Set the default 'onError' event handler.
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
     * Set the default 'onValidationError' event handler.
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
     * Set the default 'onUnauthorized' event handler.
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
     * Set the default 'onForbidden' event handler.
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
     * Set the default 'onFinished' event handler.
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
     * Set the default 'onCancelled' event handler.
     *
     * @param {function(Response)} callback
     *
     * @returns {this} The current instance.
     */
    onCancelled (callback = () => {}) {
        this._onCancelled = callback;

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

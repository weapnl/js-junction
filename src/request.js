import Action from './request/action';
import Connection from './connection';
import Filters from './filters/filters';
import Modifiers from './modifiers/modifiers';
import Pagination from './request/pagination';

import actionMixin from './mixins/actionMixin';
import filterMixin from './mixins/filterMixin';
import modifierMixin from './mixins/modifierMixin';
import paginationMixin from './mixins/paginationMixin';
import Api from './api';

/**
 * @mixes actionMixin
 * @mixes filterMixin
 * @mixes modifierMixin
 * @mixes paginationMixin
 */
export default class Request {
    constructor () {
        this.url = null;

        this._action = new Action();
        this._filters = new Filters();
        this._modifiers = new Modifiers();
        this._pagination = new Pagination();
        this._customParameters = [];

        this._onSuccess = () => {};
        this._onError = () => {};
        this._onValidationError = () => {};
        this._onUnauthorized = () => {};
        this._onForbidden = () => {};

        this._connection = new Connection();

        this._response = null;
    }

    get response () {
        return this._response;
    }

    /**
     * @param {string} url
     *
     * @returns {this} The current instance.
     */
    setUrl (url) {
        this.url = url;

        return this;
    }

    /**
     * @returns {this} The current instance.
     */
    cancel () {
        this._connection.cancel();

        return this;
    }

    /**
     * @returns {this} The current instance.
     */
    async get () {
        const url = this.url ?? this.constructor.endpoint;

        this._response = await this._connection.get(
            `${url}`,
            this.bodyParameters,
        );

        await this.triggerResponseEvents(this._response);

        return this;
    }

    /**
     * @param {Object} data
     *
     * @returns {this} The current instance.
     */
    async post (data = {}) {
        const url = this.url ?? this.constructor.endpoint;

        this._response = await this._connection.post(
            `${url}`,
            data,
        );

        await this.triggerResponseEvents(this._response);

        return this;
    }

    /**
     * @param {Object} data
     *
     * @returns {this} The current instance.
     */
    async put (data = {}) {
        const url = this.url ?? this.constructor.endpoint;

        this._response = await this._connection.put(
            `${url}`,
            { ...data, ...this.bodyParameters },
        );

        await this.triggerResponseEvents(this._response);

        return this;
    }

    /**
     * @returns {this} The current instance.
     */
    async delete () {
        const url = this.url ?? this.constructor.endpoint;

        this._response = await this._connection.delete(
            `${url}`,
        );

        await this.triggerResponseEvents(this._response);

        return this;
    }

    /**
     * @param {Object} files
     * @param {Object} data
     *
     * @returns {this} The current instance.
     */
    async storeFiles (files = {}, data = {}) {
        const url = this.url ?? this.constructor.endpoint;

        this._connection.setConfig({
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const formData = this._createFormData(_.merge({}, files, data));

        this._response = await this._connection.post(
            `${url}?${this.bodyParameters}`,
            formData,
        );

        await this.triggerResponseEvents(this._response);

        return this;
    }

    /**
     * @returns {Object} Filter and modifier query parameters.
     */
    get bodyParameters () {
        return _.merge(..._.compact([
            this._filters.toObject(),
            this._modifiers.toObject(),
            this._pagination.toObject(),
            this._action.toObject(),
            ...this._customParameters,
        ]));
    }

    /**
     * @param {function(Response.data)} callback
     *
     * @returns {this} The current instance.
     */
    onSuccess (callback = () => {}) {
        this._onSuccess = callback;

        return this;
    }

    /**
     * @param {function(Response)} callback
     *
     * @returns {this} The current instance.
     */
    onError (callback = () => {}) {
        this._onError = callback;

        return this;
    }

    /**
     * @param {function(Response.validation)} callback
     *
     * @returns {this} The current instance.
     */
    onValidationError (callback = () => {}) {
        this._onValidationError = callback;

        return this;
    }

    /**
     * @param {function(Response)} callback
     *
     * @returns {this} The current instance.
     */
    onUnauthorized (callback = () => {}) {
        this._onUnauthorized = callback;

        return this;
    }

    /**
     * @param {function(Response)} callback
     *
     * @returns {this} The current instance.
     */
    onForbidden (callback = () => {}) {
        this._onForbidden = callback;

        return this;
    }

    /**
     * @param {Response} response
     * @param {*} successResponse
     */
    async triggerResponseEvents (response, successResponse = null) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
            if (! this._onSuccess) return;

            return await this._onSuccess(...[successResponse, response.data].filter((value) => !! value));
        }

        switch (response.statusCode) {
            case 401:
                if (this._onUnauthorized) await this._onUnauthorized(response);
                break;
            case 403:
                if (this._onForbidden) await this._onForbidden(response);
                break;
            case 422:
                const validation = {
                    message: response.validation.message,
                    errors: {},
                };

                _.each(response.validation.errors, (value, key) => {
                    return _.set(validation.errors, key, value);
                });

                if (this._onValidationError) await this._onValidationError(validation);
                break;
            default:
                if (this._onError) await this._onError(response);
                break;
        }
    }

    /**
     * Add custom parameters to the request.
     *
     * @param {Array} parameters
     *
     * @returns {this} The current instance.
     */
    customParameters (parameters = []) {
        this._customParameters.push(...parameters);

        return this;
    }

    /**
     * Convert data to FormData.
     *
     * @param {Object} data
     *
     * @returns {FormData}
     */
    _createFormData (data = {}) {
        const formData = new FormData();

        function appendFormData (data, name) {
            name = name || '';

            if (data instanceof File) {
                formData.append(name, data);
            } else if (data === true || data === false) {
                formData.append(name, data ? '1' : '0');
            } else if (_.isArray(data) || _.isObject(data)) {
                if (_.size(data) <= 0) {
                    formData.append(name, '');
                } else {
                    _.forOwn(data, (dataItem, key) => {
                        const newName = name === ''
                            ? key
                            : name + '[' + key + ']';

                        appendFormData(dataItem, newName);
                    });
                }
            } else {
                formData.append(name, data);
            }
        }

        appendFormData(data);

        return formData;
    }

    /**
     * @param {Api} api
     *
     * @returns {this} The current instance.
     */
    setApi (api) {
        this._connection.setApi(api);

        return this;
    }
}

Object.assign(Request.prototype, actionMixin);
Object.assign(Request.prototype, filterMixin);
Object.assign(Request.prototype, modifierMixin);
Object.assign(Request.prototype, paginationMixin);

import Action from './request/action';
import Connection from './connection';
import Filters from './filters/filters';
import Modifiers from './modifiers/modifiers';
import Pagination from './request/pagination';

import actionMixin from './mixins/actionMixin';
import filterMixin from './mixins/filterMixin';
import modifierMixin from './mixins/modifierMixin';
import paginationMixin from './mixins/paginationMixin';

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

        this._onSuccessCallbacks = [];
        this._onErrorCallbacks = [];
        this._onValidationErrorCallbacks = [];
        this._onUnauthorizedCallbacks = [];
        this._onForbiddenCallbacks = [];
        this._onFinishedCallbacks = [];

        this._connection = new Connection();

        this._response = null;
        this.key = null;
    }

    setKey (key) {
        this.key = key;

        return this;
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
     * @param {object} config
     *
     * @returns {this} The current instance.
     */
    setConfig (config) {
        this._connection.setConfig(_.merge(this._connection.getConfig(), config));

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

        this._connection.cancelRunning(this);

        this._response = await this._connection.get(
            url,
            this.bodyParameters,
        );

        this._connection.removeRequest(this);

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

        this._connection.cancelRunning(this);

        this._response = await this._connection.post(
            url,
            { ...data, ...this.bodyParameters },
        );

        this._connection.removeRequest(this);

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

        this._connection.cancelRunning(this);

        this._response = await this._connection.put(
            url,
            { ...data, ...this.bodyParameters },
        );

        this._connection.removeRequest(this);

        await this.triggerResponseEvents(this._response);

        return this;
    }

    /**
     * @returns {this} The current instance.
     */
    async delete () {
        const url = this.url ?? this.constructor.endpoint;

        this._connection.cancelRunning(this);

        this._response = await this._connection.delete(
            url,
        );

        this._connection.removeRequest(this);

        await this.triggerResponseEvents(this._response);

        return this;
    }

    /**
     * @param {Object} files
     * @param {Object} data
     * @param {string|null} url
     *
     * @returns {this} The current instance.
     */
    async storeFiles (files = {}, data = {}, url = null) {
        let queryUrl = url ?? this.url ?? this.constructor.endpoint;

        this._connection.cancelRunning(this);

        this.setConfig({
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const formData = this._createFormData(_.merge({}, files, data));

        if (! _.isEmpty(this.bodyParameters)) {
            queryUrl = `${queryUrl}?${this.bodyParameters}`;
        }

        this._response = await this._connection.post(
            queryUrl,
            formData,
        );

        this._connection.removeRequest(this);

        this.setConfig({
            headers: {
                'Content-Type': 'application/json',
            },
        });

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
            _.merge(...this._customParameters),
        ]));
    }

    /**
     * @param {function(Response.data)} callback
     *
     * @returns {this} The current instance.
     */
    onSuccess (callback = () => {}) {
        this._onSuccessCallbacks.push(callback);

        return this;
    }

    /**
     * @param {function(Response)} callback
     *
     * @returns {this} The current instance.
     */
    onError (callback = () => {}) {
        this._onErrorCallbacks.push(callback);

        return this;
    }

    /**
     * @param {function(Response.validation)} callback
     *
     * @returns {this} The current instance.
     */
    onValidationError (callback = () => {}) {
        this._onValidationErrorCallbacks.push(callback);

        return this;
    }

    /**
     * @param {function(Response)} callback
     *
     * @returns {this} The current instance.
     */
    onUnauthorized (callback = () => {}) {
        this._onUnauthorizedCallbacks.push(callback);

        return this;
    }

    /**
     * @param {function(Response)} callback
     *
     * @returns {this} The current instance.
     */
    onForbidden (callback = () => {}) {
        this._onForbiddenCallbacks.push(callback);

        return this;
    }

    /**
     * @param {function(Response)} callback
     *
     * @returns {this} The current instance.
     */
    onFinished (callback = () => {}) {
        this._onFinishedCallbacks.push(callback);

        return this;
    }

    /**
     * Clears all `onSuccess` callbacks.
     *
     * @returns {this} The current instance.
     */
    clearOnSuccessCallbacks () {
        this._onSuccessCallbacks = [];

        return this;
    }

    /**
     * Clears all `onError` callbacks.
     *
     * @returns {this} The current instance.
     */
    clearOnErrorCallbacks () {
        this._onErrorCallbacks = [];

        return this;
    }

    /**
     * Clears all `onValidationError` callbacks.
     *
     * @returns {this} The current instance.
     */
    clearOnValidationErrorCallbacks () {
        this._onValidationErrorCallbacks = [];

        return this;
    }

    /**
     * Clears all `onUnauthorized` callbacks.
     *
     * @returns {this} The current instance.
     */
    clearOnUnauthorizedCallbacks () {
        this._onUnauthorizedCallbacks = [];

        return this;
    }

    /**
     * Clears all `onForbidden` callbacks.
     *
     * @returns {this} The current instance.
     */
    clearOnForbiddenCallbacks () {
        this._onForbiddenCallbacks = [];

        return this;
    }

    /**
     * Clears all `onFinished` callbacks.
     *
     * @returns {this} The current instance.
     */
    clearOnFinishedCallbacks () {
        this._onFinishedCallbacks = [];

        return this;
    }

    /**
     * @param {Response} response
     * @param {*} successResponse
     */
    async triggerResponseEvents (response, successResponse = null) {
        function executeCallbacks(callbacks, ...data) {
            return Promise.all(callbacks.map(async callback => {
                await callback(...data);
            }))
        }

        if (response.statusCode >= 200 && response.statusCode < 300) {
            await executeCallbacks(this._onSuccessCallbacks, ...[successResponse, response.data].filter((value) => !! value));
        } else {
            switch (response.statusCode) {
                case 401:
                    await executeCallbacks(this._onUnauthorizedCallbacks, response);
                    break;
                case 403:
                    await executeCallbacks(this._onForbiddenCallbacks, response);
                    break;
                case 422:
                    const validation = {
                        message: response.validation.message,
                        errors: {},
                    };

                    _.each(response.validation.errors, (value, key) => {
                        return _.set(validation.errors, key, value);
                    });

                    await executeCallbacks(this._onValidationErrorCallbacks, validation);
                    break;
                default:
                    await executeCallbacks(this._onErrorCallbacks, response);
                    break;
            }
        }

        if (response.isFinished) {
            await executeCallbacks(this._onFinishedCallbacks, response);
        }
    }

    /**
     * Add custom parameters to the request.
     *
     * @param {Object} parameters
     *
     * @returns {this} The current instance.
     */
    customParameters (parameters = {}) {
        this._customParameters.push(parameters);

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

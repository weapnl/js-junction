import ResponseEvents from '../response/responseEvents';

/**
 * @mixin responseEventsMixin
 */
const responseEventsMixin = {
    /**
     * Constructor of the mixin.
     *
     * @private
     */
    _initResponseEvents () {
        this._responseEvents = new ResponseEvents();
    },

    /**
     * Add `onSuccess` callback to be called after the request.
     *
     * @param {function()} callback
     *
     * @returns {this} The current instance.
     */
    onSuccess (callback = () => {}) {
        this._responseEvents.addOnSuccessCallback(callback);

        return this;
    },

    /**
     * Add `onError` callback to be called after the request.
     *
     * @param {function()} callback
     *
     * @returns {this} The current instance.
     */
    onError (callback = () => {}) {
        this._responseEvents.addOnErrorCallback(callback);

        return this;
    },

    /**
     * Add `onValidationError` callback to be called after the request.
     *
     * @param {function()} callback
     *
     * @returns {this} The current instance.
     */
    onValidationError (callback = () => {}) {
        this._responseEvents.addOnValidationErrorCallback(callback);

        return this;
    },

    /**
     * Add `onUnauthorized` callback to be called after the request.
     *
     * @param {function()} callback
     *
     * @returns {this} The current instance.
     */
    onUnauthorized (callback = () => {}) {
        this._responseEvents.addOnUnauthorizedCallback(callback);

        return this;
    },

    /**
     * Add `onForbidden` callback to be called after the request.
     *
     * @param {function()} callback
     *
     * @returns {this} The current instance.
     */
    onForbidden (callback = () => {}) {
        this._responseEvents.addOnForbiddenCallback(callback);

        return this;
    },

    /**
     * Add `onFinished` callback to be called after the request.
     *
     * @param {function()} callback
     *
     * @returns {this} The current instance.
     */
    onFinished (callback = () => {}) {
        this._responseEvents.addOnFinishedCallback(callback);

        return this;
    },

    /**
     * Add `onCancelled` callback to be called after the request.
     *
     * @param {function()} callback
     *
     * @returns {this} The current instance.
     */
    onCancelled (callback = () => {}) {
        this._responseEvents.addOnCancelledCallback(callback);

        return this;
    },

    /**
     * Clears all callbacks.
     *
     * @returns {this} The current instance.
     */
    clearAllCallbacks () {
        this._responseEvents.clearAllCallbacks();

        return this;
    },

    /**
     * Clears all `onSuccess` callbacks.
     *
     * @returns {this} The current instance.
     */
    clearOnSuccessCallbacks () {
        this._responseEvents.clearOnSuccessCallbacks();

        return this;
    },

    /**
     * Clears all `onError` callbacks.
     *
     * @returns {this} The current instance.
     */
    clearOnErrorCallbacks () {
        this._responseEvents.clearOnErrorCallbacks();

        return this;
    },

    /**
     * Clears all `onValidationError` callbacks.
     *
     * @returns {this} The current instance.
     */
    clearOnValidationErrorCallbacks () {
        this._responseEvents.clearOnValidationErrorCallbacks();

        return this;
    },

    /**
     * Clears all `onUnauthorized` callbacks.
     *
     * @returns {this} The current instance.
     */
    clearOnUnauthorizedCallbacks () {
        this._responseEvents.clearOnUnauthorizedCallbacks();

        return this;
    },

    /**
     * Clears all `onForbidden` callbacks.
     *
     * @returns {this} The current instance.
     */
    clearOnForbiddenCallbacks () {
        this._responseEvents.clearOnForbiddenCallbacks();

        return this;
    },

    /**
     * Clears all `onFinished` callbacks.
     *
     * @returns {this} The current instance.
     */
    clearOnFinishedCallbacks () {
        this._responseEvents.clearOnFinishedCallbacks();

        return this;
    },

    /**
     * Clears all `onCancelled` callbacks.
     *
     * @returns {this} The current instance.
     */
    clearOnCancelledCallbacks () {
        this._responseEvents.clearOnCancelledCallbacks();

        return this;
    },
};

export default responseEventsMixin;

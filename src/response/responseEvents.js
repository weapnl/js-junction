export default class ResponseEvents {
    constructor() {
        this._onSuccessCallbacks = [];
        this._onErrorCallbacks = [];
        this._onValidationErrorCallbacks = [];
        this._onUnauthorizedCallbacks = [];
        this._onForbiddenCallbacks = [];
        this._onFinishedCallbacks = [];
        this._onCancelledCallbacks = [];
    }

    /**
     * @param {function()} callback
     *
     * @returns {this} The current instance.
     */
    addOnSuccessCallback (callback = () => {}) {
        this._onSuccessCallbacks.push(callback);

        return this;
    }

    /**
     * @param {function()} callback
     *
     * @returns {this} The current instance.
     */
    addOnErrorCallback (callback = () => {}) {
        this._onErrorCallbacks.push(callback);

        return this;
    }

    /**
     * @param {function()} callback
     *
     * @returns {this} The current instance.
     */
    addOnValidationErrorCallback (callback = () => {}) {
        this._onValidationErrorCallbacks.push(callback);

        return this;
    }

    /**
     * @param {function()} callback
     *
     * @returns {this} The current instance.
     */
    addOnUnauthorizedCallback (callback = () => {}) {
        this._onUnauthorizedCallbacks.push(callback);

        return this;
    }

    /**
     * @param {function()} callback
     *
     * @returns {this} The current instance.
     */
    addOnForbiddenCallback (callback = () => {}) {
        this._onForbiddenCallbacks.push(callback);

        return this;
    }

    /**
     * @param {function()} callback
     *
     * @returns {this} The current instance.
     */
    addOnFinishedCallback (callback = () => {}) {
        this._onFinishedCallbacks.push(callback);

        return this;
    }

    /**
     * @param {function()} callback
     *
     * @returns {this} The current instance.
     */
    addOnCancelledCallback (callback = () => {}) {
        this._onCancelledCallbacks.push(callback);

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
     * Clears all `onCancelled` callbacks.
     *
     * @returns {this} The current instance.
     */
    clearOnCancelledCallbacks () {
        this._onCancelledCallbacks = [];

        return this;
    }

    /**
     * Clears all callbacks.
     *
     * @returns {this} The current instance.
     */
    clearAllCallbacks () {
        this.clearOnSuccessCallbacks()
            .clearOnErrorCallbacks()
            .clearOnValidationErrorCallbacks()
            .clearOnUnauthorizedCallbacks()
            .clearOnForbiddenCallbacks()
            .clearOnFinishedCallbacks()
            .clearOnCancelledCallbacks();

        return this;
    }
}

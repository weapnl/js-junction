export default class ResponseEventsHandler {
    constructor () {
        this._responseEventsList = [];

        this._onSuccessData = null;
    }

    /**
     * @param {ResponseEvents} responseEvents
     * @returns {ResponseEventsHandler}
     */
    addResponseEvents (responseEvents) {
        this._responseEventsList.push(responseEvents);

        return this;
    }

    /**
     * @param {*} data
     * @returns {ResponseEventsHandler}
     */
    setOnSuccessData (data) {
        this._onSuccessData = data;

        return this;
    }

    /**
     * @param {Response} response
     */
    async triggerResponseEvents (response) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
            await this._executeOnSuccessCallbacks(response);
        } else {
            switch (response.statusCode) {
                case 401:
                    await this._executeOnUnauthorizedCallbacks(response);
                    break;
                case 403:
                    await this._executeOnForbiddenCallbacks(response);
                    break;
                case 422:
                    await this._executeOnValidationErrorCallbacks(response);
                    break;
                default:
                    await this._executeOnErrorCallbacks(response);
                    break;
            }
        }

        if (response.isFinished) {
            await this._executeOnFinishedCallbacks(response);
        }

        if (response.isCancelled) {
            await this._executeOnCancelledCallbacks(response);
        }
    }

    /**
     * @param {function[]} callbacks
     * @param data
     * @returns {Promise}
     * @private
     */
    _executeCallbacks(callbacks, ...data) {
        return Promise.all(callbacks.map(async callback => {
            await callback(...data);
        }))
    }

    /**
     * @param {Response} response
     */
    async _executeOnSuccessCallbacks (response) {
        await this._executeCallbacks(
            this._responseEventsList.flatMap((responseEvent) => responseEvent._onSuccessCallbacks),
            ...[this._onSuccessData, response.data].filter((value) => !! value),
            response
        );
    }

    /**
     * @param {Response} response
     */
    async _executeOnErrorCallbacks (response) {
        await this._executeCallbacks(
            this._responseEventsList.flatMap((responseEvent) => responseEvent._onErrorCallbacks),
            response
        );
    }

    /**
     * @param {Response} response
     */
    async _executeOnValidationErrorCallbacks (response) {
        const validation = {
            message: response.validation.message,
            errors: {},
        };
        _.each(response.validation.errors, (value, key) => {
            return _.set(validation.errors, key, value);
        });

        await this._executeCallbacks(
            this._responseEventsList.flatMap((responseEvent) => responseEvent._onValidationErrorCallbacks),
            validation,
            response
        );
    }

    /**
     * @param {Response} response
     */
    async _executeOnUnauthorizedCallbacks (response) {
        await this._executeCallbacks(
            this._responseEventsList.flatMap((responseEvent) => responseEvent._onUnauthorizedCallbacks),
            response
        );
    }

    /**
     * @param {Response} response
     */
    async _executeOnForbiddenCallbacks (response) {
        await this._executeCallbacks(
            this._responseEventsList.flatMap((responseEvent) => responseEvent._onForbiddenCallbacks),
            response
        );
    }

    /**
     * @param {Response} response
     */
    async _executeOnFinishedCallbacks (response) {
        await this._executeCallbacks(
            this._responseEventsList.flatMap((responseEvent) => responseEvent._onFinishedCallbacks),
            response
        );
    }

    /**
     * @param {Response} response
     */
    async _executeOnCancelledCallbacks (response) {
        await this._executeCallbacks(
            this._responseEventsList.flatMap((responseEvent) => responseEvent._onCancelledCallbacks),
            response
        );
    }
}

/**
 * @interface
 */
class Property {
    /**
     * @param {Model} model
     * @param {string} key
     *
     * @returns {*} The value of the attribute.
     */
    get (model, key) {
        throw new Error('not implemented');
    }

    /**
     * @param {Model} model
     * @param {string} key
     * @param {*} value
     *
     * @returns {*} The value that was set.
     */
    set (model, key, value) {
        throw new Error('not implemented');
    }

    /**
     * @param {Model} model
     * @param {Object} json.
     */
    fromJson (model, json) {
        throw new Error('not implemented');
    }

    /**
     * @param {Model} model
     *
     * @return {Object} The json object.
     */
    toJson (model) {
        throw new Error('not implemented');
    }
}

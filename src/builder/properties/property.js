/**
 * @interface
 */
class Property {
    /**
     * @param {string} key
     *
     * @returns {*} The value of the attribute.
     */
    get (key) {
        throw new Error('not implemented');
    }

    /**
     * @param  {string} key
     * @param  {*} value
     *
     * @returns {*} The value that was set.
     */
    set (key, value) {
        throw new Error('not implemented');
    }

    /**
     * @param {Object} json.
     */
    fromJson (json) {
        throw new Error('not implemented');
    }

    /**
     * @return {Object} The json object.
     */
    toJson () {
        throw new Error('not implemented');
    }
}

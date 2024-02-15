/**
 * @implements {Property}
 */
export default class Counts {
    /**
     * @param {Model} model Instance of the model.
     */
    constructor (model) {
        _.each(model.constructor.counts(), (options, key) => {
            this.set(model, this.key(key, true), _.has(options, 'default') ? options.default : null);
        });
    }

    /**
     * @param {Model} model
     * @param {Object} json.
     */
    fromJson (model, json) {
        _.each(model.constructor.counts(), (options, key) => {
            let value = _.get(json, this.key(key));

            value = value !== undefined
                ? _.toInteger(value)
                : null;

            this.set(model, this.key(key, true), value);
        });
    }

    /**
     * @param {Model} model
     *
     * @return {Object} The attributes casted to a json object.
     */
    toJson (model) {
        const json = {};

        _.each(model.constructor.counts(), (options, key) => {
            _.set(json, key, this.get(model, key));
        });

        return json;
    }

    /**
     * @param {Model} model
     * @param {string} attribute
     *
     * @returns {*} The value of the attribute.
     */
    get (model, attribute) {
        return _.get(model, this.key(attribute, true));
    }

    /**
     * @param {Model} model
     * @param {string} attribute
     * @param {*} value
     *
     * @returns {*} The value that was set.
     */
    set (model, attribute, value) {
        model[this.key(attribute, true)] = value;

        return value;
    }

    /**
     * @param {string} key
     * @param {boolean} camelCase
     * @returns {string} The key with `count` appended to it, in specified casing.
     */
    key (key, camelCase = false) {
        key = _.snakeCase(key);

        if (! _.endsWith(key, '_count')) {
            key = `${key}_count`;
        }

        return camelCase ? _.camelCase(key) : key;
    }
}

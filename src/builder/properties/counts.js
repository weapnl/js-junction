/**
 * @implements {Property}
 */
export default class Counts {
    #model;

    /**
     * @param {Model} model Instance of the model.
     */
    constructor (model) {
        this.#model = model;

        _.each(model.constructor.counts(), (options, key) => {
            this.set(this.key(key, true), _.has(options, 'default') ? options.default : null);
        });
    }

    /**
     * @param {Object} json.
     */
    fromJson (json) {
        _.each(this.#model.constructor.counts(), (options, key) => {
            let value = _.get(json, this.key(key));

            value = value !== undefined
                ? _.toInteger(value)
                : null;

            this.set(this.key(key, true), value);
        });
    }

    /**
     * @return {Object} The attributes casted to a json object.
     */
    toJson () {
        const json = {};

        _.each(this.#model.constructor.counts(), (options, key) => {
            _.set(json, key, this.get(key));
        });

        return json;
    }

    /**
     * @param {string} attribute
     *
     * @returns {*} The value of the attribute.
     */
    get (attribute) {
        return _.get(this.#model, this.key(attribute, true));
    }

    /**
     * @param  {string} attribute
     * @param  {*} value
     *
     * @returns {*} The value that was set.
     */
    set (attribute, value) {
        this.#model[this.key(attribute, true)] = value;

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

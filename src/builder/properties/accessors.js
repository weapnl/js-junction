import Caster from '../caster';

/**
 * @implements {Property}
 */
export default class Accessors {
    /**
     * @param {Model} model Instance of the model.
     */
    constructor (model) {
        _.each(model.constructor.accessors(), (options, key) => {
            this.set(model, key, _.has(options, 'default') ? options.default : null);
        });
    }

    /**
     * @param {Model} model
     * @param {Object} json.
     */
    fromJson (model, json) {
        _.each(model.constructor.accessors(), (options, key) => {
            let value = _.get(json, options.jsonKey ?? _.snakeCase(key), _.get(json, _.camelCase(key)));

            if (_.isNil(value)) {
                value = _.has(options, 'default') ? options.default : null;
            } else {
                value = Accessors._getCastedFromJsonValue(value, options);
            }

            this.set(model, key, value);
        });
    }

    /**
     * @param {Model} model
     *
     * @return {Object} The attributes casted to a json object.
     */
    toJson (model) {
        const json = {};

        _.each(model.constructor.accessors(), (options, key) => {
            let jsonValue = this.get(model, key);

            jsonValue = Accessors._getCastedToJsonValue(jsonValue, options);

            _.set(json, options.jsonKey ?? _.snakeCase(key), jsonValue);
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
        return _.get(model, attribute);
    }

    /**
     * @param {Model} model
     * @param {string} attribute
     * @param {*} value
     *
     * @returns {*} The value that was set.
     */
    set (model, attribute, value) {
        model[attribute] = value;

        return value;
    }

    /**
     * @private
     *
     * @param {*} value
     * @param {Object} options
     *
     * @returns {*} The casted value.
     */
    static _getCastedFromJsonValue (value, options) {
        if (_.has(options, 'type') || _.has(options, 'fromJson')) {
            const cast = options.type ? options.type : options.fromJson;

            if (_.isArray(value)) {
                return _.map(value, (val) => Caster.fromJson(cast, val));
            } else {
                return Caster.fromJson(cast, value);
            }
        }

        return value;
    }

    /**
     * @private
     *
     * @param {*} value
     * @param {Object} options
     *
     * @returns {*} The casted value.
     */
    static _getCastedToJsonValue (value, options) {
        if (_.has(options, 'type') || _.has(options, 'toJson')) {
            const cast = options.type ? options.type : options.toJson;

            if (_.isArray(value)) {
                return _.map(value, (val) => Caster.toJson(cast, val));
            } else {
                return Caster.toJson(cast, value);
            }
        }

        return value;
    }
}

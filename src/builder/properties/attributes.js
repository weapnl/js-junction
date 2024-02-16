import Caster from '../caster';

/**
 * @implements {Property}
 */
export default class Attributes {
    /**
     * @param {Model} model Instance of the model.
     */
    constructor (model) {
        _.each(model.constructor.attributes(), (options, key) => {
            this.set(model, key, _.has(options, 'default') ? options.default : null);
        });
    }

    /**
     * @param {Model} model
     * @param {Object} json.
     */
    fromJson (model, json) {
        _.each(model.constructor.attributes(), (options, key) => {
            let value = _.get(json, options.jsonKey ?? _.snakeCase(key), _.get(json, _.camelCase(key)));

            if (_.isNil(value)) {
                value = _.has(options, 'default') ? options.default : null;
            } else {
                value = Attributes._getCastedFromJsonValue(value, options);
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

        _.each(model.constructor.attributes(), (options, key) => {
            let jsonValue = this.get(model, key);

            jsonValue = Attributes._getCastedToJsonValue(jsonValue, options);

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
     * @param {string|Object} attribute
     * @param {*} value
     *
     * @returns {Attributes}
     */
    set (model, attribute, value = null) {
        if (_.isObject(attribute)) {
            _.each(model.constructor.attributes(), (options, key) => {
                if (! _.has(attribute, key)) return;

                this.set(model, key, attribute[key]);
            });

            return this;
        }

        model[attribute] = value;

        return this;
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

            return Caster.fromJson(cast, value);
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

            return Caster.toJson(cast, value);
        }

        return value;
    }
}

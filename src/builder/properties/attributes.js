import Caster from '../caster';

/**
 * @implements {Property}
 */
export default class Attributes {
    /**
     * @param {Model} model Instance of the model.
     */
    constructor (model) {
        this.model = model;

        _.each(model.constructor.attributes(), (options, key) => {
            this.set(key, _.has(options, 'default') ? options.default : null);
        });
    }

    /**
     * @param {Object} json.
     */
    fromJson (json) {
        _.each(this.model.constructor.attributes(), (options, key) => {
            let value = _.get(json, options.jsonKey ?? _.snakeCase(key), _.get(json, _.camelCase(key)));

            if (_.isNil(value)) {
                value = _.has(options, 'default') ? options.default : null;
            } else {
                value = Attributes._getCastedFromJsonValue(value, options);
            }

            this.set(key, value);
        });
    }

    /**
     * @return {Object} The attributes casted to a json object.
     */
    toJson () {
        const json = {};

        _.each(this.model.constructor.attributes(), (options, key) => {
            let jsonValue = this.get(key);

            jsonValue = Attributes._getCastedToJsonValue(jsonValue, options);

            _.set(json, options.jsonKey ?? _.snakeCase(key), jsonValue);
        });

        return json;
    }

    /**
     * @param {string} attribute
     *
     * @returns {*} The value of the attribute.
     */
    get (attribute) {
        return _.get(this.model, attribute);
    }

    /**
     * @param  {string|Object} attribute
     * @param  {*} value
     *
     * @returns {Attributes}
     */
    set (attribute, value = null) {
        if (_.isObject(attribute)) {
            _.each(this.model.constructor.attributes(), (options, key) => {
                if (! _.has(attribute, key)) return;

                this.set(key, attribute[key]);
            });

            return this;
        }

        this.model[attribute] = value;

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

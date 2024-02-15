import Caster from '../caster';

/**
 * @implements {Property}
 */
export default class Relations {
    /**
     * @param {Model} model Instance of the model.
     */
    constructor (model) {
        _.each(model.constructor.relations(), (options, key) => {
            this.set(model, key, _.has(options, 'default') ? options.default : null);
        });
    }

    /**
     * @param {Model} model
     * @param {Object} json.
     */
    fromJson (model, json) {
        _.each(model.constructor.relations(), (options, key) => {
            let value = _.get(json, options.jsonKey ?? _.snakeCase(key), _.get(json, _.camelCase(key)));

            value = value
                ? Relations._getCastedFromJsonValue(value, options)
                : value;

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

        _.each(model.constructor.relations(), (options, key) => {
            let jsonValue = this.get(model, key);

            jsonValue = Relations._getCastedToJsonValue(jsonValue, options);

            _.set(json, options.jsonKey ?? _.snakeCase(key), jsonValue);
        });

        return json;
    }

    /**
     * @param {Model} model
     * @param {string} relation
     *
     * @returns {*} The value of the relation.
     */
    get (model, relation) {
        return _.get(model, relation);
    }

    /**
     * @param {Model} model
     * @param {string|Object} relation
     * @param {*} value
     *
     * @returns {Relations}
     */
    set (model, relation, value = null) {
        if (_.isObject(relation)) {
            _.each(model.constructor.relations(), (options, key) => {
                if (! _.has(relation, key)) return;

                this.set(model, key, relation[key]);
            });

            return this;
        }

        model[relation] = value;

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
        if (_.has(options, 'type')) {
            const cast = options.type;

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
        if (_.has(options, 'type')) {
            const cast = options.type;

            if (_.isArray(value)) {
                return _.map(value, (val) => Caster.toJson(cast, val));
            } else {
                return Caster.toJson(cast, value);
            }
        }

        return value;
    }
}

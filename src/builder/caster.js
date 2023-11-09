import Model from './model';

export default class Caster {
    /**
     * Get the casted value from a json value.
     *
     * @param {Object} cast
     * @param {any} value
     *
     * @returns {any}
     */
    static fromJson (cast, value) {
        if (cast.prototype instanceof Model) {
            return this._castValue(value, (json) => cast.fromJson(json));
        }

        if (cast === Array) {
            return this._castValue(value, (json) => Array.from(json));
        }

        if (cast === Object) {
            return this._castValue(value, (json) => Object.assign({}, json));
        }

        return this._castValue(value, _.flow(cast));
    }

    /**
     * Get the casted value of a property so it's safe to send with json.
     *
     * @param {Object} cast
     * @param {any} value
     *
     * @returns {any}
     */
    static toJson (cast, value) {
        if (_.isNil(value)) {
            return null;
        }

        if (cast.prototype instanceof Model) {
            return this._castValue(value, (model) => model.toJson());
        }

        if (cast === Array) {
            return this._castValue(value, (value) => Array.from(value));
        }

        return this._castValue(value, _.flow(cast));
    }

    /**
     * Cast the value with the given cast method.
     *
     * @param {Function} cast
     * @param {any} value
     *
     * @returns {any}
     */
    static _castValue (value, cast) {
        if (_.isNil(value)) {
            return null;
        }

        return cast(value);
    }
}

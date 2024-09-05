/**
 * @implements {Property}
 */
export default class MediaCollections {
    /**
     * @param {Model} model Instance of the model.
     */
    constructor (model) {
    }

    /**
     * @param {Model} model
     *
     * @return {Object} The attributes casted to a json object.
     */
    toJson (model) {
        const json = {};

        _.each(model.constructor.mediaCollections(), (options, key) => {
            const mediaPrefix = '_media.';
            let value = _.get(model, options.jsonKey ?? mediaPrefix + key, _.get(model, mediaPrefix + _.camelCase(key)));

            _.set(json, mediaPrefix + key, value ?? []);
        });

        return json;
    }
}

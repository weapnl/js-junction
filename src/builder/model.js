import Accessors from './properties/accessors';
import Attributes from './properties/attributes';
import Counts from './properties/counts';
import Relations from './properties/relations';
import Request from '../request';

export default class Model extends Request {
    constructor (defaults = {}) {
        super();

        this._accessors = new Accessors(this);
        this._attributes = new Attributes(this);
        this._counts = new Counts(this);
        this._relations = new Relations(this);

        this.setApi(api);
        this.fill(defaults);
    }

    /**
     * Create an instance of the model for the given json object.
     *
     * @param {Object} json
     *
     * @returns {this} An instance of the model.
     */
    static fromJson (json) {
        const instance = new (this)();

        instance._accessors.fromJson(instance, json);
        instance._attributes.fromJson(instance, json);
        instance._counts.fromJson(instance, json);
        instance._relations.fromJson(instance, json);

        return instance;
    }

    /**
     * Convert the attributes of the current instance to json.
     *
     * @return {Object} The attributes of the current instance as json object.
     */
    toJson () {
        return {
            ...this._accessors.toJson(this),
            ...this._attributes.toJson(this),
            ...this._counts.toJson(this),
            ...this._relations.toJson(this),
        };
    }

    /**
     * @param values
     * @returns {this}
     */
    fill (values = {}) {
        this._attributes.set(this, values);
        this._relations.set(this, values);

        return this;
    }

    /**
     * The accessors of the model which were appended on the api side.
     *
     * @returns {Object.<any, Object>}
     */
    static accessors () {
        return {};
    }

    /**
     * The attributes of the model.
     *
     * @returns {Object.<any, Object>}
     */
    static attributes () {
        return {};
    }

    /**
     * The counts of relations of the model.
     *
     * @returns {Object.<any, Object>}
     */
    static counts () {
        return {};
    }

    /**
     * The relations of the model.
     *
     * @returns {Object.<any, Object>}
     */
    static relations () {
        return {};
    }

    /**
     * @returns {string} Endpoint of the model for the API.
     */
    static get endpoint () {
        throw new Error('No endpoint defined in the model.');
    }

    /**
     * @returns {int} Identifier attribute name of the model.
     */
    get _identifier () {
        return _.get(this, 'id');
    }

    /**
     * Get a list of models.
     *
     * @returns {this[]} List of models.
     */
    async index () {
        this._response = await this._connection.post(
            this._queryString() + '/index',
            this.bodyParameters,
        );

        let items;

        if (this._response.data) {
            items = _.map(this._response.data.items, (item) => {
                return this.constructor.fromJson(item);
            });
        }

        await this.triggerResponseEvents(this._response, items);

        return items;
    }

    /**
     * Get a single model.
     *
     * @param {int} [identifier]
     *
     * @returns {this} Model found for the given id.
     */
    async show (identifier) {
        identifier ??= this._identifier;

        if (! identifier) return null;

        this._response = await this._connection.post(
            this._queryString(identifier) + '/show',
            this.bodyParameters,
        );

        let item;

        if (this._response.data) {
            item = this.constructor.fromJson(this._response.data);
        }

        await this.triggerResponseEvents(this._response, item);

        return item;
    }

    /**
     * Create an model.
     *
     * @param {Object} [extraData] Extra data to send to the API
     *
     * @returns {this} The created model.
     */
    async store (extraData = {}) {
        this._response = await this._connection.post(
            this._queryString(),
            { ...this._attributes.toJson(this), ...extraData },
        );

        let item;

        if (this._response.data) {
            item = this.constructor.fromJson(this._response.data);
        }

        await this.triggerResponseEvents(this._response, item);

        return item;
    }

    /**
     * Update the current model.
     *
     * @param {Object} [extraData] Extra data to send to the API
     *
     * @returns {this} The updated model.
     */
    async update (extraData = {}) {
        this._response = await this._connection.put(
            this._queryString(this._identifier),
            { ...this._attributes.toJson(this), ...extraData },
        );

        let item;

        if (this._response.data) {
            item = this.constructor.fromJson(this._response.data);
        }

        await this.triggerResponseEvents(this._response, item);

        return item;
    }

    /**
     * Delete the current model.
     *
     * @returns {boolean} Whether the deletion was successful.
     */
    async destroy () {
        this._response = await this._connection.delete(
            this._queryString(this._identifier),
        );

        await this.triggerResponseEvents(this._response);

        return !! this._response.data;
    }

    /**
     * Save the current model. Based on the value of the identifier `store` or `update` will be called.
     *
     * @param {Object} [extraData] Extra data to send to the API
     *
     * @returns {this} The created or updated model.
     */
    async save (extraData = {}) {
        return ! this._identifier
            ? this.store(extraData)
            : this.update(extraData);
    }

    /**
     * @returns {this} The new clone of the current model.
     */
    clone () {
        return this.constructor.fromJson(this.toJson());
    }

    /**
     * Generate the query string for this model.
     * @private
     *
     * @param {int} [identifier] The identifier of the model.
     *
     * @returns {string} The querystring for the model.
     */
    _queryString (identifier) {
        return this.constructor.endpoint
            + (identifier ? `/${identifier}` : '');
    }
}

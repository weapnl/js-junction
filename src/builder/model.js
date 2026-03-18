import Accessors from './properties/accessors';
import Attributes from './properties/attributes';
import Counts from './properties/counts';
import Relations from './properties/relations';
import MediaCollections from './properties/mediaCollections';
import Request from '../request';

export default class Model extends Request {
    constructor (defaults = {}) {
        super();

        this._accessors = new Accessors(this);
        this._attributes = new Attributes(this);
        this._counts = new Counts(this);
        this._relations = new Relations(this);
        this._mediaCollections = new MediaCollections(this);

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
            ...this._mediaCollections.toJson(this),
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
     * The media collections of the model
     *
     * @returns {Object.<any, Object>}
     */
    static mediaCollections () {
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
        this._connection.cancelRunning(this);

        this._response = await this._connection.post(
            this._queryString() + '/index',
            this.bodyParameters,
        );

        this._connection.removeRequest(this);

        let items;

        if (this._response.data) {
            items = _.map(this._response.data.items, (item) => {
                return this.constructor.fromJson(item);
            });
        }

        const responseEventsHandler = this._createResponseEventsHandler();
        responseEventsHandler.setOnSuccessData(items);
        await responseEventsHandler.triggerResponseEvents(this._response);

        this.clearAllCallbacks();

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

        this._connection.cancelRunning(this);

        this._response = await this._connection.post(
            this._queryString(identifier) + '/show',
            this.bodyParameters,
        );

        this._connection.removeRequest(this);

        let item;

        if (this._response.data) {
            item = this.constructor.fromJson(this._response.data);
        }

        const responseEventsHandler = this._createResponseEventsHandler();
        responseEventsHandler.setOnSuccessData(item);
        await responseEventsHandler.triggerResponseEvents(this._response);

        this.clearAllCallbacks();

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
        this._connection.cancelRunning(this);

        this._response = await this._connection.post(
            this._queryString(),
            {
                ...this._attributes.toJson(this),
                ...this._mediaCollections.toJson(this),
                ..._.merge(...this._customParameters),
                ...extraData,
            },
        );

        this._connection.removeRequest(this);

        let item;

        if (this._response.data) {
            item = this.constructor.fromJson(this._response.data);
        }

        const responseEventsHandler = this._createResponseEventsHandler();
        responseEventsHandler.setOnSuccessData(item);
        await responseEventsHandler.triggerResponseEvents(this._response);

        this._clearMediaAfterSave();
        this.clearAllCallbacks();

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
        this._connection.cancelRunning(this);

        this._response = await this._connection.put(
            this._queryString(this._identifier),
            {
                ...this._attributes.toJson(this),
                ...this._mediaCollections.toJson(this),
                ..._.merge(...this._customParameters),
                ...extraData,
            },
        );

        this._connection.removeRequest(this);

        let item;

        if (this._response.data) {
            item = this.constructor.fromJson(this._response.data);
        }

        const responseEventsHandler = this._createResponseEventsHandler();
        responseEventsHandler.setOnSuccessData(item);
        await responseEventsHandler.triggerResponseEvents(this._response);

        this._clearMediaAfterSave();
        this.clearAllCallbacks();

        return item;
    }

    /**
     * Delete the current model.
     *
     * @param {Object} [extraData] Extra data to send to the API
     *
     * @returns {boolean} Whether the deletion was successful.
     */
    async destroy (extraData = {}) {
        this._connection.cancelRunning(this);

        this._response = await this._connection.delete(
            this._queryString(this._identifier),
            {
                ..._.merge(...this._customParameters),
                ...extraData,
            },
        );

        this._connection.removeRequest(this);

        const responseEventsHandler = this._createResponseEventsHandler();
        await responseEventsHandler.triggerResponseEvents(this._response);

        this.clearAllCallbacks();

        return !! this._response.data;
    }

    /**
     * Upload an temporary media file to the API.
     *
     * @param {array|File} [files] The uploaded file or files.
     * @param {string} [collection] The name of the file collection.
     *
     * @returns {array} The received media ids.
     */
    async upload (files, collection) {
        this._media ??= {};

        // Extract clear callback from the files array (if present).
        const clearCallback = typeof files?._clearCallback === 'function' ? files._clearCallback : null;

        if (clearCallback) {
            this._pendingMediaClearCallbacks ??= new Map();
            this._pendingMediaClearCallbacks.set(collection, clearCallback);
        }

        files = _.flatMapDeep(Array.isArray(files) ? files : [files]).filter((value) => value instanceof File);

        if (files.length === 0) {
            this._media[collection] = {};
            return;
        }

        const chunkSize = typeof this._connection.getChunkUploadSize === 'function'
            ? this._connection.getChunkUploadSize()
            : null;

        const chunks = chunkSize ? this._chunkFilesBySize(files, chunkSize) : [files];

        let allResponseData = [];

        for (const chunk of chunks) {
            const request = await this.storeFiles({
                files: chunk,
            }, {}, '/media/upload');

            if (request._response.data) {
                allResponseData = allResponseData.concat(
                    _.castArray(request._response.data),
                );
            }
        }

        this._media[collection] = allResponseData;

        // Also register globally so it fires when saving through a different model.
        if (clearCallback && allResponseData.length) {
            Model._globalMediaCallbacks.set(
                JSON.stringify(allResponseData),
                clearCallback,
            );
        }

        return allResponseData;
    }

    /**
     * Split files into chunks that don't exceed the given max size.
     * A single file that exceeds the limit will still be sent as its own chunk.
     *
     * @param {File[]} files
     * @param {number} maxSize Maximum total file size per chunk in bytes.
     *
     * @returns {File[][]} Array of file arrays (chunks).
     * @private
     */
    _chunkFilesBySize (files, maxSize) {
        const chunks = [];
        let currentChunk = [];
        let currentSize = 0;

        for (const file of files) {
            const fileSize = file.size || 0;

            if (currentChunk.length > 0 && currentSize + fileSize > maxSize) {
                chunks.push(currentChunk);
                currentChunk = [];
                currentSize = 0;
            }

            currentChunk.push(file);
            currentSize += fileSize;
        }

        if (currentChunk.length > 0) {
            chunks.push(currentChunk);
        }

        return chunks;
    }

    /**
     * Clear pending media and invoke any registered cleanup callbacks.
     */
    clearMedia () {
        // Fire instance-level callbacks (registered immediately in upload).
        if (this._pendingMediaClearCallbacks?.size) {
            this._pendingMediaClearCallbacks.forEach((callback) => callback());
            this._pendingMediaClearCallbacks.clear();
        }

        // Fire global callbacks (for cross-model saves).
        this._invokeMediaCallbacks(this._media);

        this._media = {};
    }

    /**
     * Clear media after a successful store/update.
     *
     * @private
     */
    _clearMediaAfterSave () {
        if (this._response.statusCode >= 200 && this._response.statusCode < 300) {
            this.clearMedia();
        }
    }

    /**
     * Invoke and remove any pending media cleanup callbacks matching the given media collections.
     *
     * @param {Object} media
     * @private
     */
    _invokeMediaCallbacks (media) {
        if (! media) return;

        _.each(media, (value) => {
            if (! value) return;

            const key = JSON.stringify(value);
            const callback = Model._globalMediaCallbacks.get(key);

            if (callback) {
                callback();
                Model._globalMediaCallbacks.delete(key);
            }
        });
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

Model._globalMediaCallbacks = new Map();

export default class Batch {
    constructor (requests) {
        this._requests = requests;
    }

    get successful () {
        return _.isEmpty(this.failedRequests);
    }

    get successfulRequests () {
        return _.filter(this._requests, ['response.failed', false]);
    }

    get failedRequests () {
        return _.filter(this._requests, ['response.failed', true]);
    }

    async get () { return this.execute('get'); }
    async post () { return this.execute('post'); }
    async put () { return this.execute('put'); }
    async delete () { return this.execute('delete'); }
    async index () { return this.execute('index'); }
    async show () { return this.execute('show'); }
    async store () { return this.execute('store'); }
    async update () { return this.execute('update'); }
    async destroy () { return this.execute('destroy'); }
    async save () { return this.execute('save'); }
    async storeFiles () { return this.execute('storeFiles'); }

    /**
     * @param {string} method The methods used to execute the requests. Should be `index`, `show`, `store`, `update` or `delete`.
     * @returns {array} List of results if all requests were successful.
     */
    async execute (method) {
        return await Promise.all(_.map(this._requests, (request) => {
            return request[method]();
        }));
    }
}

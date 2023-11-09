import Filter from './filter';

export default class Relations extends Filter {
    constructor () {
        super();

        this._scopes = [];
    }

    filled () {
        return this._scopes.length > 0;
    }

    add (name, params) {
        this._scopes.push({
            name,
            params,
        });
    }

    toObject () {
        const data = {};

        if (this.filled()) {
            data.scopes = this._scopes;
        }

        return data;
    }
}

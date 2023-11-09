import Filter from './filter';

export default class Limit extends Filter {
    constructor () {
        super();

        this._amount = null;
    }

    filled () {
        return !! this._amount;
    }

    amount (amount) {
        this._amount = amount;
    }

    toObject () {
        const data = {};

        if (this.filled()) {
            data.limit = this._amount;
        }

        return data;
    }
}

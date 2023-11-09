import Filter from './filter';

export default class Order extends Filter {
    constructor () {
        super();

        this._orders = [];
    }

    filled () {
        return this._orders.length > 0;
    }

    add (column, direction) {
        this._orders.push({
            column,
            direction,
        });
    }

    toObject () {
        const data = {};

        if (this.filled()) {
            data.orders = this._orders;
        }

        return data;
    }
}

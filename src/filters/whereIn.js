import Filter from './filter';
import Format from '../utilities/format';

export default class Relations extends Filter {
    constructor () {
        super();

        this._whereIns = [];
    }

    filled () {
        return this._whereIns.length > 0;
    }

    add (column, values) {
        this._whereIns.push({
            column: Format.snakeCase(column),
            values,
        });
    }

    toObject () {
        const data = {};

        if (this.filled()) {
            data.where_in = this._whereIns;
        }

        return data;
    }
}

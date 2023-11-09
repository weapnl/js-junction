import Filter from './filter';
import Format from '../utilities/format';

export default class Wheres extends Filter {
    constructor () {
        super();

        this._wheres = [];
    }

    filled () {
        return this._wheres.length > 0;
    }

    add (column, operator, value) {
        this._wheres.push({
            column: Format.snakeCase(column),
            operator,
            value,
        });
    }

    toObject () {
        const data = {};

        if (this.filled()) {
            data.wheres = this._wheres;
        }

        return data;
    }
}

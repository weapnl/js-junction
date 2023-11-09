import Filter from './filter';
import Format from '../utilities/format';

export default class Search extends Filter {
    constructor () {
        super();

        this._value = null;
        this._columns = null;
    }

    filled () {
        return this._value;
    }

    value (value) {
        this._value = value;
    }

    columns (columns) {
        this._columns = _.map(columns, Format.snakeCase);
    }

    toObject () {
        const data = {};

        if (this.filled()) {
            data.search_value = this._value;
            data.search_columns = this._columns;
        }

        return data;
    }
}

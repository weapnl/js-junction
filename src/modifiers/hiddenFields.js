import Modifier from './modifier';

export default class HiddenFields extends Modifier {
    constructor () {
        super();

        this._fields = [];
    }

    filled () {
        return this._fields.length > 0;
    }

    add (fields) {
        this._fields.push(...fields);
    }

    toObject () {
        const data = {};

        if (this.filled()) {
            data.hidden_fields = this._fields;
        }

        return data;
    }
}

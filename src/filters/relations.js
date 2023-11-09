import Filter from './filter';

export default class Relations extends Filter {
    constructor () {
        super();

        this._relations = [];
    }

    filled () {
        return this._relations.length > 0;
    }

    add (relations) {
        this._relations.push(...relations);
    }

    toObject () {
        const data = {};

        if (this.filled()) {
            data.with = this._relations;
        }

        return data;
    }
}

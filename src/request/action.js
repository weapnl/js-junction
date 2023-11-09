export default class Action {
    constructor () {
        this._name = null;
        this._id = null;
    }

    filled () {
        return !! this._name;
    }

    name (name) {
        this._name = name;
    }

    id (id) {
        this._id = id;
    }

    toObject () {
        if (! this.filled()) return null;

        const data = {};

        data.action = this._name;
        if (this._id) data.id = this._id;

        return data;
    }
}

import Modifier from './modifier';
import Format from '../utilities/format';

export default class Appends extends Modifier {
    constructor () {
        super();

        this._appends = [];
    }

    filled () {
        return this._appends.length > 0;
    }

    add (appends) {
        this._appends.push(..._.map(appends, Format.snakeCase));
    }

    toObject () {
        const data = {};

        if (this.filled()) {
            data.appends = this._appends;
        }

        return data;
    }
}

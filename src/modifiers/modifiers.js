import Appends from './appends';
import HiddenFields from './hiddenFields';

export default class Modifiers {
    constructor () {
        this.appends = new Appends();
        this.hiddenFields = new HiddenFields();
    }

    toObject () {
        const items = [];

        for (let i = 0, modifiers = ['appends', 'hiddenFields']; i < modifiers.length; i++) {
            if (this[modifiers[i]].filled()) items.push(this[modifiers[i]].toObject());
        }

        return _.merge(...items);
    }
}

/**
 * @mixin actionMixin
 */
const actionMixin = {
    /**
     * @param {string} name
     * @param {int} [id]
     * @returns {this}
     */
    action (name, id) {
        id ??= this._identifier;

        this._action.name(name);
        this._action.id(id);

        return this;
    },
};

export default actionMixin;

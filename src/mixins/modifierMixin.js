/**
 * @mixin modifierMixin
 */
const modifierMixin = {
    appends (appends) {
        if (! Array.isArray(appends)) appends = [appends];

        this._modifiers.appends.add(appends);

        return this;
    },

    hiddenFields (hiddenFields) {
        if (! Array.isArray(hiddenFields)) hiddenFields = [hiddenFields];

        this._modifiers.hiddenFields.add(hiddenFields);

        return this;
    },
};

export default modifierMixin;

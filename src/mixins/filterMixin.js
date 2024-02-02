/**
 * @mixin filterMixin
 */
const filterMixin = {
    count (relations) {
        if (! Array.isArray(relations)) relations = [relations];

        this._filters.count.add(relations);

        return this;
    },

    limit (amount) {
        this._filters.limit.amount(amount);

        return this;
    },

    order (input, direction = 'asc') {
        // If a single column name (string) is specified
        if (typeof input === 'string') {
            this._filters.order.add(_.snakeCase(input), direction);
        }

        // If there is an array input
        else if (Array.isArray(input)) {
            input.forEach(item => {
                // If the item is a string (single column name)
                if (typeof item === 'string') {
                    this._filters.order.add(_.snakeCase(input), 'asc');
                }

                // If the item is an array ([column name, direction])
                else if (Array.isArray(item)) {
                    const [column, direction = 'asc'] = item; // default value for dir is 'asc' if not specified

                    this._filters.order.add(_.snakeCase(column), direction);
                }
            });
        }

        return this;
    },

    with (relations) {
        if (! Array.isArray(relations)) relations = [relations];

        this._filters.relations.add(relations);

        return this;
    },

    scope (name, ...params) {
        this._filters.scopes.add(name, params);

        return this;
    },

    scopes (input) {
        input.forEach(scope => {
            if (Array.isArray(scope)) {
                this.scope(...scope);
            } else {
                this.scope(scope);
            }
        });

        return this;
    },

    search (value, columns = []) {
        if (! Array.isArray(columns)) columns = [columns];

        this._filters.search.value(value);
        this._filters.search.columns(columns);

        return this;
    },

    where (column, operator, value) {
        if (arguments.length === 2) {
            value = operator;
            operator = '=';
        }

        this._filters.wheres.add(column, operator, value);

        return this;
    },

    wheres (input) {
        input.forEach(where => {
            this.where(...where);
        });

        return this;
    },

    whereIn (column, values) {
        if (! Array.isArray(values)) values = [values];

        this._filters.whereIn.add(column, values);

        return this;
    },

    whereIns (input) {
        input.forEach(whereIn => {
            this.whereIn(...whereIn);
        });

        return this;
    },

    pluck (fields) {
        if (! Array.isArray(fields)) fields = [fields];

        this._filters.pluck.add(fields);

        return this;
    },
};

export default filterMixin;

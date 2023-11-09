export default class Format {
    static snakeCase (value) {
        const relations = _.split(value, '.');
        const attribute = relations.pop();

        return _.join([
            ...relations,
            _.snakeCase(attribute),
        ], '.');
    }
}

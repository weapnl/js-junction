/**
 * @mixin paginationMixin
 */
const paginationMixin = {
    /**
     * @param {int} page
     * @param {int} [perPage]
     * @param {null|int} [findPageForId] Find the page the given id is on.
     * @returns {this}
     */
    pagination (page, perPage = 25, findPageForId = null) {
        this._pagination.page(page);
        this._pagination.perPage(perPage);
        this._pagination.findPageForId(findPageForId);

        return this;
    },
};

export default paginationMixin;

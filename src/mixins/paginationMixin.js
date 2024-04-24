/**
 * @mixin paginationMixin
 */
const paginationMixin = {
    /**
     * @param {int} page
     * @param {int} [perPage]
     * @param {null|int} [findPageForId] Find the page the given id is on.
     * @param {boolean} [simplePagination] Use simple pagination or not, default is false.
     * @returns {this}
     */
    pagination (page, perPage = 25, findPageForId = null, simplePagination = false) {
        this._pagination.page(page);
        this._pagination.perPage(perPage);
        this._pagination.findPageForId(findPageForId);
        this._pagination.simplePagination(simplePagination);

        return this;
    },
};

export default paginationMixin;

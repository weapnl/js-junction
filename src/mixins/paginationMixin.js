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
        this._pagination.simplePagination(false);

        return this;
    },

    /**
     * @param {int} [perPage]
     * @returns {this}
     */
    simplePagination (perPage = 25) {
        this._pagination.simplePagination(true);
        this._pagination.perPage(perPage);

        return this;
    },
};

export default paginationMixin;

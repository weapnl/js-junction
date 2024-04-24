export default class Pagination {
    constructor () {
        this._page = null;
        this._perPage = null;
        this._findPageForId = null;
        this._simplePagination = false;
    }

    filled () {
        return this._perPage && (this._page || this._findPageForId);
    }

    page (page) {
        this._page = page;
    }

    perPage (perPage) {
        this._perPage = perPage;
    }

    findPageForId (id) {
        this._findPageForId = id;
    }

    simplePagination (simplePagination) {
        this._simplePagination = simplePagination;
    }

    toObject () {
        const data = {};

        if (this.filled()) {
            data.page = this._page;
            data.paginate = this._perPage;
            data.page_for_id = this._findPageForId;
            data.simplePagination = this._simplePagination;
        }

        return data;
    }
}

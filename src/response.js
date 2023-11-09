export default class Response {
    constructor () {
        this._axiosResponse = null;

        this.statusCode = null;

        this.data = null;

        this.validation = null;
    }

    get failed () {
        return this.statusCode >= 400;
    }

    set (statusCode, axiosResponse) {
        this._axiosResponse = axiosResponse;

        this.statusCode = statusCode;

        switch (this.statusCode) {
            case 200:
                this.data = this._axiosResponse.data;
                break;
            case 400:
                this.data = this._axiosResponse.response.data;
                break;
            case 422:
                this.validation = this._axiosResponse.response.data;
                break;
        }
    }
}

import axios from 'axios';

export default class Response {
    constructor () {
        this._axiosResponse = null;
        this._axiosError = null;

        this.data = null;
        this.validation = null;
    }

    /**
     * @deprecated Use `isFailed` instead.
     * @returns {boolean}
     */
    get failed () {
        return this.isFailed;
    }

    /**
     * @returns {boolean}
     */
    get isFailed () {
        return this.statusCode >= 400;
    }

    /**
     * Check whether the request is finished and returned a response.
     *
     * @returns {boolean}
     */
    get isFinished () {
        return this._axiosResponse !== null;
    }

    /**
     * Check whether the request was cancelled.
     *
     * @returns {boolean}
     */
    get isCancelled () {
        return axios.isCancel(this._axiosError);
    }

    /**
     * @returns {Number} The HTTP response status code.
     */
    get statusCode () {
        return this._axiosResponse?.status;
    }

    setAxiosResponse(axiosResponse) {
        this._axiosResponse = axiosResponse;

        switch (this.statusCode) {
            case 200:
            case 400:
                this.data = this._axiosResponse.data;
                break;
            case 422:
                this.validation = this._axiosResponse.data;
                break;
        }
    }

    setAxiosError (axiosError) {
        this._axiosError = axiosError;

        if (axiosError.response) {
            this.setAxiosResponse(axiosError.response);
        }
    }
}

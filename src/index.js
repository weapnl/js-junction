import _ from 'lodash';
import Api from './api';
import Model from './builder/model';

window._ = _;

const api = new Api();
window.api = api;

export { Model };

export default api;

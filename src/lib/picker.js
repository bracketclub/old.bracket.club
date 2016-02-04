import {pick} from 'lodash';

export default (prop) => (obj) => pick(obj, prop)[prop];

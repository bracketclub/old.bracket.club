import {transform} from 'lodash';

export default (obj, selectKey, keyTransform) => !obj ? null : transform(obj, (res, val, key) => {
  res[key] = key === selectKey ? keyTransform(val) : val;
});

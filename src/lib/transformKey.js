import {transform} from 'lodash';

export default (obj, selectKey, keyTransform, newKey = '') => {
  if (!obj) return null;

  return transform(obj, (res, val, key) => {
    const resKey = key === selectKey ? (newKey || key) : key;
    res[resKey] = key === selectKey ? keyTransform(val) : val;
  });
};

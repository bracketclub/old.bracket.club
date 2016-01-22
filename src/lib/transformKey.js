import {transform} from 'lodash';

export default (obj, selectKey, keyTransform, newKey) => {
  if (!obj) return null;

  return transform(obj, (res, val, key) => {
    res[key === selectKey ? newKey || key : key] = key === selectKey ? keyTransform(val) : val;
  });
};

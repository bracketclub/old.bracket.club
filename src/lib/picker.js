import {pick} from 'lodash';

export default (...props) => (obj) => {
  const picked = pick(obj, ...props);
  return props.length === 1 ? picked[props[0]] : picked;
};

import {bindActionCreators} from 'redux';
import {transform} from 'lodash';

export default (obj) => (dispatch) => transform(obj, (res, val, key) => {
  res[key] = bindActionCreators(val, dispatch);
});

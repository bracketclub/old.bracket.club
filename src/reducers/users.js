import {union} from 'lodash';

import {users} from '../schema';
import endpointCreator from './endpoint';

export default endpointCreator(users, (objValue, srcValue, key) => {
  if (key === 'entries' && Array.isArray(objValue)) {
    return union(objValue, srcValue);
  }
  return void 0;
});

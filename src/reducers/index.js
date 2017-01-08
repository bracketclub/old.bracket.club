import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import * as schema from '../schema';
import me from './me';
import event from './event';
import entry from './entry';
import canWin from './canWin';
import endpointCreator from './endpoint';

export default combineReducers({
  me,
  event,
  entry,
  canWin,
  users: endpointCreator(schema.user),
  masters: endpointCreator(schema.master),
  entries: endpointCreator(schema.entry),
  routing: routerReducer
});

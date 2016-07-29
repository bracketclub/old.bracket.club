import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import {masters, entries} from '../schema';
import me from './me';
import event from './event';
import entry from './entry';
import canWin from './canWin';
import users from './users';
import endpointCreator from './endpoint';

export default combineReducers({
  me,
  event,
  entry,
  users,
  canWin,
  masters: endpointCreator(masters),
  entries: endpointCreator(entries),
  routing: routerReducer
});

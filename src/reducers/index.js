import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import {masters, entries, users} from '../schema';
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
  users: endpointCreator(users),
  masters: endpointCreator(masters),
  entries: endpointCreator(entries),
  routing: routerReducer
});

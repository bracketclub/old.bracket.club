import {combineReducers} from 'redux';
import {routeReducer} from 'react-router-redux';

import schema from '../schema';
import me from './me';
import event from './event';
import entry from './entry';
import endpointCreator from './endpoint';

export default combineReducers({
  me,
  event,
  entry,
  masters: endpointCreator(schema.masters),
  entries: endpointCreator(schema.entries),
  users: endpointCreator(schema.users),
  routing: routeReducer
});

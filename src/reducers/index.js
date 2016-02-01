import {combineReducers} from 'redux';
import {routeReducer} from 'redux-simple-router';

import schema from '../schema';

import me from './me';
import event from './event';
import entry from './entry';
import endpointCreator from './creators/endpoint';

export default combineReducers({
  me,
  event,
  entry,
  masters: endpointCreator(schema.masters),
  entries: endpointCreator(schema.entries),
  users: endpointCreator(schema.users),
  routing: routeReducer
});

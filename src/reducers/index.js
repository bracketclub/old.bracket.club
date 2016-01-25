import {combineReducers} from 'redux';
import {routeReducer} from 'redux-simple-router';
import reduceReducers from 'reduce-reducers';

import schema from '../schema';

import me from './me';
import entry from './entry';
import event from './event';
import endpointCreator from './creators/endpoint';

export default reduceReducers(
  // These reducers only depend on their slice of the state
  combineReducers({
    me,
    event,
    entry: (state = {}) => state,
    masters: endpointCreator(schema.masters),
    entries: endpointCreator(schema.entries),
    users: endpointCreator(schema.users),
    routing: routeReducer
  }),
  // These reducers can depend on the entire tree and they should
  // come after the combined reducers above since they will depend on
  // some of that initial state
  entry
);

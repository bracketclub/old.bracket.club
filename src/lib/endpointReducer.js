import {combineReducers} from 'redux';
import actionNames from 'action-names';
import {mergeWith, union} from 'lodash';

// These constants are used through selectors and middleware to allow for these
// keys to change more easily in the future
export const RESULT = 'result';
export const RECORDS = 'records';
export const ENTITIES = 'entities';
export const SYNC_STATE = {syncing: false, refreshing: false, fetchError: null};

const recordsReducerFor = (resourceType) => {
  const defaultRecordState = {...SYNC_STATE, [RESULT]: null};
  const types = actionNames(resourceType);

  return (state = {}, action) => {
    const updateState = (newState) => {
      const {id, cid} = action.meta || {};
      const updatedState = {...state};

      if (id) updatedState[id] = {...defaultRecordState, ...state[id], ...newState};
      if (cid) updatedState[cid] = {...defaultRecordState, ...state[cid], ...newState};

      return updatedState;
    };

    switch (action.type) {

    case types.fetchStart:
      return updateState({syncing: !action.meta.refresh, refreshing: !!action.meta.refresh});

    case types.fetchSuccess:
      return updateState({syncing: false, refreshing: false, fetchError: null, [RESULT]: action.payload[RESULT]});

    case types.fetchError:
      return updateState({syncing: false, refreshing: false, fetchError: action.payload});

    default:
      return state;
    }
  };
};

// All entities have already been normalized by this point so any arrays are ids
// which we only want the union of so thay none are duplicated
// See https://lodash.com/docs/#mergeWith and https://lodash.com/docs/#union for more info
const mergeEntities = (previous, current) => mergeWith({}, previous, current, (previousVal, currentVal) => {
  if (Array.isArray(currentVal)) {
    return union(previousVal, currentVal);
  }
  // Returning undefined means that lodash falls back to a recursive merge
  return void 0;
});

const entitiesReducerFor = (resourceType) => {
  const defaultState = {};

  const types = actionNames(resourceType);

  return (state = defaultState, action) => {
    switch (action.type) {

    case types.fetchSuccess:
      return mergeEntities(state, action.payload[ENTITIES][resourceType]);

    default:
      return state;
    }
  };
};

export default (schema) => combineReducers({
  [RECORDS]: recordsReducerFor(schema.key),
  [ENTITIES]: entitiesReducerFor(schema.key)
});

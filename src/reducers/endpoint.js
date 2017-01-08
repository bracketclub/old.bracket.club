import {combineReducers} from 'redux';
import actionNames from 'action-names';

const recordsReducerFor = (resourceType) => {
  const defaultRecordState = {
    result: null,
    syncing: false,
    refreshing: false,
    fetchError: null
  };

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
      return updateState({syncing: false, refreshing: false, fetchError: null, result: action.payload.result});

    case types.fetchError:
      return updateState({syncing: false, refreshing: false, fetchError: action.payload});

    default:
      return state;
    }
  };
};

// TODO: check merge strategy against caching if you go from user -> user 2012 -> user -> user 2013 (should be cached)
const entitiesReducerFor = (resourceType) => {
  const defaultState = {};

  const types = actionNames(resourceType);

  return (state = defaultState, action) => {
    switch (action.type) {

    case types.fetchSuccess:
      return {...state, ...action.payload.entities[resourceType]};

    default:
      return state;
    }
  };
};

export default (schema) => combineReducers({
  records: recordsReducerFor(schema.key),
  entities: entitiesReducerFor(schema.key)
});

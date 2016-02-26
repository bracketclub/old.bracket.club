import {combineReducers} from 'redux';
import actionNames from 'action-names';

const recordsReducerFor = (resourceType) => {
  const defaultRecordState = {
    results: [],
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

    const results = () => {
      const {result} = action.payload;
      return {results: (Array.isArray(result) ? result : [result]).filter(Boolean)};
    };

    switch (action.type) {

    case types.fetchStart:
      return updateState({syncing: !action.meta.refresh, refreshing: !!action.meta.refresh});

    case types.fetchSuccess:
      return updateState({syncing: false, refreshing: false, fetchError: null, ...results()});

    case types.fetchError:
      return updateState({syncing: false, refreshing: false, fetchError: action.payload});

    default:
      return state;
    }
  };
};

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
  records: recordsReducerFor(schema.getKey()),
  entities: entitiesReducerFor(schema.getKey())
});

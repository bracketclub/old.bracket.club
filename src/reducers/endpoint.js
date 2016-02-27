import {combineReducers} from 'redux';
import actionNames from 'action-names';
import {mergeWith} from 'lodash';

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

const entitiesReducerFor = (resourceType, mergeEntities) => {
  const defaultState = {};

  const types = actionNames(resourceType);

  return (state = defaultState, action) => {
    switch (action.type) {

    case types.fetchSuccess:
      const entities = action.payload.entities[resourceType];
      return mergeEntities ? mergeWith(state, entities, mergeEntities) : {...state, ...entities};

    default:
      return state;
    }
  };
};

export default (schema, mergeEntities) => combineReducers({
  records: recordsReducerFor(schema.getKey()),
  entities: entitiesReducerFor(schema.getKey(), mergeEntities)
});

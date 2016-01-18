import {snakeCase} from 'lodash';

const makeErrorObject = (error) => {
  if (error.status === 0) {
    return {status: 0, error: 'Could not connect to API server', message: ''};
  }

  const DEFAULT_SERVER_ERROR = 500;
  const status = error.status || DEFAULT_SERVER_ERROR;
  const errorText = (error.data && error.data.error) || error.statusText || 'Internal Server Error';
  const message = status === 404
    ? 'That entry does not exist' // TODO: better generic 404 message
    : ((error.data && error.data.message) || 'An internal server error occurred');

  return {status, error: errorText, message};
};

export default (entity) => {
  const defaultState = {
    sync: {
      syncing: false,
      lastError: null
    },
    records: []
  };

  const resourceType = snakeCase(entity.getKey()).toUpperCase();

  return (state = defaultState, action) => {
    switch (action.type) {
    case `${resourceType}_FETCH_START`:
      return {
        ...state,
        sync: {syncing: true, lastError: null}
      };

    case `${resourceType}_FETCH_SUCCESS`:
      return {
        ...state,
        records: action.data,
        sync: {syncing: false, lastError: null}
      };

    case `${resourceType}_FETCH_ERROR`:
      return {
        ...state,
        sync: {syncing: false, lastError: makeErrorObject(action.error)}
      };

    default:
      return state;
    }
  };
};

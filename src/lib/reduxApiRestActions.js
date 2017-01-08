import config from 'config';
import {CALL_API, getJSON} from 'redux-api-middleware';
import {normalize} from 'normalizr';
import actionNames from 'action-names';

export default ({schema, url, cache} = {}) => {
  const resource = schema.key;
  const types = actionNames(resource);
  // If the response is an array then normalize it using the array version of the schema
  const payloadSchema = (data) => Array.isArray(data) ? [schema] : schema;

  return (params, {refresh = false} = {}) => {
    const id = params;
    return (dispatch) => dispatch({
      [CALL_API]: {
        method: 'GET',
        endpoint: `${url}/${params}${config.static ? '.json' : ''}`,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        types: [
          {
            type: types.fetchStart,
            meta: () => ({id, resource, refresh})
          },
          {
            type: types.fetchSuccess,
            payload: (acton, state, res) => getJSON(res).then((json) => normalize(json, payloadSchema(json))),
            meta: () => ({id, resource, refresh})
          },
          {
            type: types.fetchError,
            meta: () => ({id, resource, refresh})
          }
        ],
        bailout: (state) => typeof cache === 'function' ? cache(state, id) : cache
      }
    });
  };
};

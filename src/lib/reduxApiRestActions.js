import {CALL_API, getJSON} from 'redux-api-middleware';
import {normalize, arrayOf} from 'normalizr';
import actionNames from 'action-names';
import mapQueryToKey from 'lib/mapQueryToKey';

const manipulateJSON = (manipulate) => (action, state, res) => getJSON(res).then(manipulate);

const normalizePayload = (payloadSchema, id) => manipulateJSON((json) => {
  const schema = Array.isArray(json) ? arrayOf(payloadSchema) : payloadSchema;
  return normalize(json, schema);
});

export default ({schema, url} = {}) => {
  const resource = schema.getKey();
  const types = actionNames(resource);

  return {
    fetch(params, {refresh = false} = {}) {
      const {endpoint, key} = mapQueryToKey(params);

      return (dispatch) => dispatch({
        [CALL_API]: {
          method: 'GET',
          endpoint: `${url}${endpoint}`,
          types: [
            {
              type: types.fetchStart,
              meta: () => ({id: key, resource, refresh})
            },
            {
              type: types.fetchSuccess,
              payload: normalizePayload(schema, key),
              meta: () => ({id: key, resource})
            },
            {
              type: types.fetchError,
              meta: () => ({id: key, resource})
            }
          ]
        }
      });
    }
  };
};

import config from 'config';
import {CALL_API, getJSON} from 'redux-api-middleware';
import {normalize, arrayOf} from '@lukekarrys/normalizr';
import actionNames from 'action-names';

const manipulateJSON = (manipulate) => (action, state, res) => getJSON(res).then(manipulate);

const normalizePayload = (payloadSchema) => manipulateJSON((json) => {
  const schema = Array.isArray(json) ? arrayOf(payloadSchema) : payloadSchema;
  return normalize(json, schema);
});

export default ({schema, url, cache} = {}) => {
  const resource = schema.getKey();
  const types = actionNames(resource);

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
            payload: normalizePayload(schema),
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

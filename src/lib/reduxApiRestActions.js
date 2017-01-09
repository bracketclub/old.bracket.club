import config from 'config';
import {CALL_API, getJSON} from 'redux-api-middleware';
import {normalize as baseNormalize} from 'normalizr';
import actionNames from 'action-names';
import {ENTITIES, RESULT} from 'lib/endpointReducer';

// Remap entities and result here since those keys are controlled by the constants
// in the endpoint reducer
const normalize = (schema) => (acton, state, res) => getJSON(res).then((json) => {
  const {entities, result} = baseNormalize(json, schema(json));
  return {[ENTITIES]: entities, [RESULT]: result};
});

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
            payload: normalize(payloadSchema),
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

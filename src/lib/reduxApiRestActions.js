import config from 'config';
import {CALL_API, getJSON} from 'redux-api-middleware';
import {normalize as baseNormalize} from 'normalizr';
import actionNames from 'lib/actionNames';
import {ENTITIES, RESULT} from 'lib/endpointReducer';

// Remap entities and result here since those keys are controlled by the constants
// in the endpoint reducer
const normalize = (schema) => (acton, state, res) => getJSON(res).then((json) => {
  // If the response is an array then normalize it using the array version of the schema
  schema = Array.isArray(json) ? [schema] : schema;
  const {entities, result} = baseNormalize(json, schema);
  return {[ENTITIES]: entities, [RESULT]: result};
});

export default ({schema, url, bailout} = {}) => {
  const resource = schema.key;
  const types = actionNames(resource);

  return (id, {refresh = false} = {}) => {
    const meta = () => ({id, resource, refresh, schema});

    return (dispatch) => dispatch({
      [CALL_API]: {
        method: 'GET',
        endpoint: `${url}/${id}${config.static ? '.json' : ''}`,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        types: [
          {
            meta,
            type: types.fetchStart
          },
          {
            meta,
            type: types.fetchSuccess,
            payload: normalize(schema)
          },
          {
            meta,
            type: types.fetchError
          }
        ],
        bailout: (state) => !refresh && bailout && bailout(state, id)
      }
    });
  };
};

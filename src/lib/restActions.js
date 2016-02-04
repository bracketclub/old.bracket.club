import axios from 'axios';
import {normalize, arrayOf} from 'normalizr';
import {values, snakeCase} from 'lodash';

const actionName = (resource) => snakeCase(resource).toUpperCase();

const dispatchNestedEntities = (dispatch, entities, mainResourceType) => {
  Object.keys(entities).forEach((resourceType) => {
    if (resourceType !== mainResourceType) {
      dispatch({
        type: `${actionName(resourceType)}_FETCH_SUCCESS`,
        data: values(entities[resourceType])
      });
    }
  });
};

export default (config) => {
  const {schema, url} = config;

  const resource = schema.getKey();
  const resourceAction = actionName(resource);

  const FETCH_START = `${resourceAction}_FETCH_START`;
  const FETCH_SUCCESS = `${resourceAction}_FETCH_SUCCESS`;
  const FETCH_ERROR = `${resourceAction}_FETCH_ERROR`;

  const fetch = (normalizeSchema) => (id) => (dispatch) => {
    dispatch({type: FETCH_START});

    axios.get(`${url}${id ? `/${id}` : ''}`)
    .then(
      (response) => {
        const {entities} = normalize(response.data, normalizeSchema);
        dispatchNestedEntities(dispatch, entities, resource);
        dispatch({type: FETCH_SUCCESS, data: values(entities[resource])});
      },
      (err) => dispatch({type: FETCH_ERROR, error: err})
    );
  };

  return {
    fetchOne: fetch(schema),
    fetchAll: fetch(arrayOf(schema))
  };
};

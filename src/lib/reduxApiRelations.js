import actionNames from 'action-names';
import {without} from 'lodash';

import {ENTITIES, RESULT} from './endpointReducer';

const findRelationSchema = (schema, key) => {
  const schemas = schema.schema;
  const keys = Object.keys(schemas);

  for (let i = 0, m = keys.length; i <= m; i++) {
    const relSchema = schemas[keys[i]];
    const relSchemaObject = Array.isArray(relSchema) ? relSchema[0] : relSchema;

    if (relSchemaObject.key === key) {
      return relSchema;
    }
  }

  return null;
};

export default ({dispatch}) => (next) => (action) => {
  // The next action is run first because any related resources should
  // be dispatched after the main resource
  // eslint-disable-next-line callback-return
  next(action);

  const {meta = {}, payload = {}} = action;
  const {[ENTITIES]: entities} = payload;
  const {resource, schema} = meta;

  if (entities && resource && schema) {
    const relations = without(Object.keys(entities), resource);

    relations.forEach((relation) => {
      const relatedEntities = entities[relation];
      const success = actionNames(relation).fetchSuccess;
      const relationSchema = findRelationSchema(schema, relation);

      // Dispatch the related entities to the reducer
      dispatch({
        type: success,
        payload: {
          [ENTITIES]: {[relation]: relatedEntities},
          [RESULT]: {}
        }
      });

      // Of all the related entities, dispatch a result for each one so that
      // the records reducer can be populated to know that this data is loaded
      // for other possible pages. Currently this is done by determining if the
      // relation schema is an object and not an array
      if (relationSchema && !Array.isArray(relationSchema)) {
        Object.keys(relatedEntities).forEach((id) => {
          dispatch({
            type: success,
            meta: {
              ...meta,
              resource: relation,
              id: `${id}/${meta.id}`
            },
            payload: {
              [ENTITIES]: {},
              [RESULT]: id
            }
          });
        });
      }
    });
  }
};

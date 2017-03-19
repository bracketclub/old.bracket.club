import {without} from 'lodash';
import actionNames from 'lib/actionNames';
import {ENTITIES, RESULT} from './endpointReducer';

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

      // Dispatch the related entities to the reducer
      dispatch({
        type: success,
        payload: {
          [ENTITIES]: {[relation]: relatedEntities}
        }
      });

      // The schema can define how to determine related records
      // The entities are determined by normalizr (above), but there are cases where
      // the records needs to be updated as well to show things like when a
      // user is fetched, the store now has the records for each individual user/entry combo
      // const relationSchema = findRelationSchema(schema, relation);
      // const findRecords = schema.relatedRecords || (relationSchema && relationSchema.relatedRecords);
      const records = schema.relatedRecords && schema.relatedRecords({
        meta,
        entities: relatedEntities
      });

      if (records) {
        dispatch({
          type: actionNames(records.resource).fetchSuccess,
          payload: {[RESULT]: records.result},
          meta: {ids: records.id}
        });
      }
    });
  }
};

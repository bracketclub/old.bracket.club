import actionNames from 'action-names';
import {without} from 'lodash';

import {ENTITIES, RESULT} from './endpointReducer';

export default ({dispatch}) => (next) => (action) => {
  // The next action is run first because any related resources should
  // be dispatched after the main resource
  // eslint-disable-next-line callback-return
  next(action);

  const {meta = {}, payload = {}} = action;
  const {[ENTITIES]: entities} = payload;
  const {resource} = meta;

  if (entities && resource) {
    const relations = without(Object.keys(entities), resource);

    relations.forEach((relation) => {
      const relatedEntities = entities[relation];
      const success = actionNames(relation).fetchSuccess;

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
      // for other possible pages
      // TODO: this should only happen for entries -> users and not users -> entries
      // as the former doesn't have enough data to fully cache the entries result
      // Object.keys(relatedEntities).forEach((id) => {
      //   dispatch({
      //     type: success,
      //     meta: {
      //       ...meta,
      //       resource: relation,
      //       id: `${id}/${meta.id}`
      //     },
      //     payload: {
      //       [ENTITIES]: {},
      //       [RESULT]: id
      //     }
      //   });
      // });
    });
  }
};

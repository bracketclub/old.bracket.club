import actionNames from 'action-names';
import {without} from 'lodash';

export default ({dispatch}) => (next) => (action) => {
  // The next action is run first because any related resources should
  // be dispatched after the main resource
  // eslint-disable-next-line callback-return
  next(action);

  const {meta = {}, payload = {}} = action;
  const {entities} = payload;
  const {resource} = meta;

  if (entities && resource) {
    without(Object.keys(entities), resource).forEach((resourceType) => {
      dispatch({
        type: actionNames(resourceType).fetchSuccess,
        payload: {
          entities: {
            [resourceType]: entities[resourceType]
          }
        }
      });
    });
  }
};

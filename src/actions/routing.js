import {routeActions} from 'redux-simple-router';

export const replaceQuery = ({location, query}) => routeActions.replace({
  ...location,
  query: {...location.query, ...query}
});

import {routeActions} from 'react-router-redux';

export const replaceQuery = ({location, query}) => routeActions.replace({
  ...location,
  query: {...location.query, ...query}
});

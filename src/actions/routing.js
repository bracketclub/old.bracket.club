import {replace} from 'react-router-redux';

export const replaceQuery = ({location, query}) => replace({
  ...location,
  query: {...location.query, ...query}
});

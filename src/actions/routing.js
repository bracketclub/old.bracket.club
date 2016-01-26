import {routeActions} from 'redux-simple-router';

export const replaceQuery = ({location, query}) => (dispatch) => {
  dispatch(routeActions.replace({
    ...location,
    query: {
      ...location.query,
      ...query
    }
  }));
};

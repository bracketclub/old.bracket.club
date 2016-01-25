import config from 'config';
import restActions from '../lib/restActions';
import {routeActions} from 'redux-simple-router';
import {masters as schema} from '../schema';

const goToIndex = ({game, location}) => (dispatch) => {
  dispatch(routeActions.replace({
    ...location,
    query: {
      ...location.query,
      game
    }
  }));
};

const goToFirst = ({location}) => goToIndex({
  location,
  game: 0
});

const goToPrevious = ({current, location}) => goToIndex({
  location,
  game: Math.max(0, current - 1)
});

const goToNext = ({current, total, location}) => goToIndex({
  location,
  game: Math.min(total, current + 1)
});

const goToLast = ({total, location}) => goToIndex({
  location,
  game: total
});

export default {
  ...restActions({
    schema,
    url: `${config.apiUrl}/masters`
  }),
  goToFirst,
  goToLast,
  goToNext,
  goToPrevious
};

import config from 'config';
import restActions from '../lib/restActions';
import * as routeActions from './routing';
import {masters as schema} from '../schema';

const goToFirst = ({location}) => routeActions.replaceQuery({
  location,
  query: {game: 0}
});

const goToPrevious = ({current, location}) => routeActions.replaceQuery({
  location,
  query: {game: Math.max(0, current - 1)}
});

const goToNext = ({current, total, location}) => routeActions.replaceQuery({
  location,
  query: {game: Math.min(total, current + 1)}
});

const goToLast = ({total, location}) => routeActions.replaceQuery({
  location,
  query: {game: total}
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

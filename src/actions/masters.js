import config from 'config';
import * as actions from '../constants/masters';
import restActions from '../lib/restActions';
import {masters as schema} from '../schema';

const goToFirst = () => ({
  type: actions.GOTO_FIRST
});

const goToLast = () => ({
  type: actions.GOTO_LAST
});

const goToNext = () => ({
  type: actions.GOTO_NEXT
});

const goToPrevious = () => ({
  type: actions.GOTO_PREVIOUS
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

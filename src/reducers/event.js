import config from 'config';
import {LOCATION_CHANGE} from '../constants/history';
import * as types from '../constants/event';

const initialState = {
  sport: config.sport,
  year: config.year,
  ...config.events.reduce((acc, event) => {
    acc[event] = {locked: true};
    return acc;
  }, {})
};

export default (state = initialState, action) => {
  switch (action.type) {
  case LOCATION_CHANGE: {
    // Looks for a pathname that looks like
    // /ncaam-2016 -> {sport: ncaam, year: 2016}
    // The sport is optionally only because previous year urls did not include it
    const matches = action.payload.pathname.match(/^\/(\w+)?-?(\d{4})/);
    const sport = matches && matches[1] && matches[1];
    const year = matches && matches[2] && matches[2];

    return {
      ...state,
      sport: sport || state.sport,
      year: year || state.year
    };
  }

  case types.UNLOCK:
    return {
      ...state,
      [action.payload.id]: {
        ...(state[action.payload.id] || {}),
        locked: false
      }
    };

  case types.LOCK:
    return {
      ...state,
      [action.payload.id]: {
        ...(state[action.payload.id] || {}),
        locked: true
      }
    };

  default:
    return state;
  }
};

/* global __SPORT__, __YEAR__ */

import {UPDATE_LOCATION} from 'redux-simple-router';

import * as types from '../constants/event';

const initialState = {
  sport: __SPORT__,
  year: __YEAR__
};

export default (state = initialState, action) => {
  switch (action.type) {

  case UPDATE_LOCATION:
    // Looks for a pathname that looks like
    // /ncaam-2016 -> {sport: ncaam, year: 2016}
    // /2016 -> {year: 2016}
    const matches = action.payload.pathname.match(/^\/(\w+)?-?(\d{4})/);
    const sport = matches && matches[1] && matches[1];
    const year = matches && matches[2] && matches[2];

    return {
      ...state,
      sport: sport || state.sport,
      year: year || state.year
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

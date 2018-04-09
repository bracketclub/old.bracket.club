import {startCase} from 'lodash';

const uppercase = /\b(ncaa|nba|nhl)\b/gi;
const fullnames = {
  ncaam: 'NCAAM',
  ncaaw: 'NCAAW'
};

export const parse = (o) => typeof o === 'string' ? {sport: o.split('-')[0], year: o.split('-')[1]} : o;

export const sport = (s) => {
  const sportFullname = fullnames[s] || s;
  const displaySport = startCase(sportFullname.replace(uppercase, (u) => u.toUpperCase()));
  return displaySport;
};

export const year = (y) => y.toString();

export default (options) => {
  const {sport: s, year: y} = parse(options);
  return `${year(y)} ${sport(s)}`;
};

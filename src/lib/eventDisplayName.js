import {startCase} from 'lodash';

const uppercase = /\b(ncaa|nba|nhl)\b/gi;
const fullnames = {
  ncaam: 'mens',
  ncaaw: 'womens'
};

const parts = (o) => typeof o === 'string' ? {sport: o.split('-')[0], year: o.split('-')[1]} : o;

export default (options) => {
  const {sport, year} = parts(options);

  const displaYear = year.toString();
  const sportFullname = fullnames[sport] || sport;
  const displaySport = startCase(sportFullname.replace(uppercase, (s) => s.toUpperCase()));

  return `${displaYear} ${displaySport}`;
};

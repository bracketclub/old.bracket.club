import {memoize, find, partial, without} from 'lodash';
import bracketData from 'bracket-data';
import BracketUpdater from 'bracket-updater';
import BracketGenerator from 'bracket-generator';
import BracketValidator from 'bracket-validator';
import BracketScorer from 'bracket-scorer';

// Columns and scoring keys for each sport
const STANDARD = 'standard';
const STANDARD_PPR = `${STANDARD}PPR`;
const GOOLEY = 'gooley';
const GOOLEY_PPR = `${GOOLEY}PPR`;
const ROUNDS = 'rounds';
const BONUS = 'bonus';

const NCAA_BB = {
  types: [STANDARD, STANDARD_PPR, ROUNDS, GOOLEY, GOOLEY_PPR],
  columns: [
    {key: 'rounds.0', display: 'Rd 1', hideXs: true},
    {key: 'rounds.1', display: 'Rd 2', hideXs: true},
    {key: 'rounds.2', display: 'S16', hideXs: true},
    {key: 'rounds.3', display: 'E8', hideXs: true},
    {key: 'rounds.4', display: 'FF', hideXs: true},
    {key: 'rounds.5', display: 'NC', hideXs: true},
    {key: STANDARD, display: 'Score'},
    {key: STANDARD_PPR, display: 'PPR'},
    {key: GOOLEY, display: 'Gooley', hideXs: true, hideSm: true},
    {key: GOOLEY_PPR, display: 'Gooley PPR', hideXs: true, hideSm: true}
  ]
};

const SIXTEEN_TEAMS_CONFERENCE = {
  types: [STANDARD, STANDARD_PPR, ROUNDS, BONUS],
  columns: [
    {key: 'rounds.0', display: 'CQF', hideXs: true},
    {key: 'rounds.1', display: 'CSF', hideXs: true},
    {key: 'rounds.2', display: 'CF', hideXs: true},
    {key: 'rounds.3', display: 'F', hideXs: true},
    {key: STANDARD, display: 'Score'},
    {key: STANDARD_PPR, display: 'PPR'}
  ]
};

const SCORES = {
  ncaam: NCAA_BB,
  ncaaw: NCAA_BB,
  nhl: SIXTEEN_TEAMS_CONFERENCE,
  nba: SIXTEEN_TEAMS_CONFERENCE
};

// These help format validated brackets and scored brackets into a normalized
// object for use by our views
const findNextRegion = (bracket, regions) =>
  find(bracket, (region) => regions.indexOf(region.id) === -1);

const getRegionsFor = (finalId, firstId, bracket) => {
  if (bracket instanceof Error) {
    return bracket;
  }

  const regionFinal = bracket[finalId];
  const output = {regions: {left: [], right: []}, regionFinal};
  const getRegion = {
    1: () => bracket[firstId],
    2: () => bracket[getRegion['1']().sameSideAs],
    3: () => findNextRegion(bracket, [getRegion['1']().id, getRegion['2']().id, finalId]),
    4: () => bracket[getRegion['3']().sameSideAs]
  };

  const regionIds = without(Object.keys(bracket), finalId);

  if (regionIds.length === 2) {
    output.regions.left.push(getRegion['1']());
    output.regions.right.push(getRegion['2']());
  }
  else {
    output.regions.left.push(getRegion['1'](), getRegion['2']());
    output.regions.right.push(getRegion['3'](), getRegion['4']());
  }

  return output;
};

const idResolver = (o) => `${o.sport}-${o.year}`;

// Make it easy to test when the app locks soon
const globalLocks = {};
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-unused-vars
  const nowPlus = (str) => new Date(new Date().valueOf() + require('ms')(str)).toJSON();
  // globalLocks['ncaam-2016'] = nowPlus('1d');
  // globalLocks['ncaaw-2016'] = nowPlus('1d');
  // globalLocks['nba-2016'] = nowPlus('1d');
  // globalLocks['nhl-2016'] = nowPlus('1d');
}

// Each sport, year combo is memoized since they never change
// Also the individual methods are also memoized based on their parameters
// The `scorer.score` is the slowest, but might as well do 'em all
export default memoize((options) => {
  const sportYear = {
    sport: options.sport,
    year: options.year
  };
  const id = idResolver(sportYear);

  const {constants, scoring, regex, locks, complete, bracket: bracketObj} = bracketData(sportYear);

  const validator = new BracketValidator(sportYear);
  const updater = new BracketUpdater(sportYear);
  const generator = new BracketGenerator(sportYear);
  const scorer = new BracketScorer(sportYear);
  const getRegions = partial(getRegionsFor, constants.FINAL_ID, constants.REGION_IDS[0]);

  const boundValidator = validator.validate.bind(validator);
  const boundUpdater = updater.update.bind(updater);
  const boundNext = updater.next.bind(updater);
  const boundGenerator = generator.generate.bind(generator);
  const boundScorer = scorer.score.bind(scorer, SCORES[sportYear.sport].types);
  const boundDiff = scorer.diff.bind(scorer);

  const hasBestOf = constants.BEST_OF > 1;

  return {
    regex,
    complete,
    columns: SCORES[sportYear.sport].columns,
    locks: globalLocks[id] || locks,
    bracket: bracketObj,
    emptyBracket: constants.EMPTY,
    totalGames: (constants.TEAMS_PER_REGION * constants.REGION_COUNT) - 1,
    unpickedChar: constants.UNPICKED_MATCH,
    finalId: constants.FINAL_ID,
    bestOf: hasBestOf && constants.BEST_OF,
    bestOfRange: hasBestOf && constants.BEST_OF_RANGE,
    bestOfWins: hasBestOf && constants.BEST_OF_RANGE[0],
    scoring: scoring[STANDARD],

    // Dont memoize since it can be used to return a random bracket
    generate: boundGenerator,

    // Memoized by id plus the bracket argument
    validate: memoize((bracket) => getRegions(boundValidator(bracket)), (bracket) => id + bracket),

    // Memoized by id and the two brackets passed in
    diff: memoize((o) => getRegions(boundDiff(o)), (o) => id + o.master + o.entry),

    // Memoized by stringifying the options
    update: memoize(boundUpdater, (o) => id + JSON.stringify(o)),
    next: memoize(boundNext, (o) => id + JSON.stringify(o)),

    // Memoized by types (array), master (string), and entry (array)
    // Important: this only allows it to be used by passing the entry
    // as a string
    score: memoize(boundScorer, (o) =>
      id + o.master + (typeof o.entry === 'string' ? o.entry : Math.random())
    )
  };
}, idResolver);

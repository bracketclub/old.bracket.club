'use strict';

import {memoize, find, pluck, partial} from 'lodash';
import bracketData from 'bracket-data';
import BracketUpdater from 'bracket-updater';
import BracketGenerator from 'bracket-generator';
import BracketValidator from 'bracket-validator';
import BracketScorer from 'bracket-scorer';

// These help format validated brackets and scored brackets into a normalized
// object for use by our views
const findNextRegion = (bracket, regions) =>
  find(bracket, (region) => pluck(regions, 'id').indexOf(region.id) === -1);

const getRegionsFor = (finalId, firstId, bracket) => {
  if (bracket instanceof Error) {
    return bracket;
  }

  const regionFinal = bracket[finalId];
  const region1 = bracket[firstId];
  const region2 = bracket[region1.sameSideAs];
  const region3 = findNextRegion(bracket, [region1, region2, regionFinal]);
  const region4 = bracket[region3.sameSideAs];

  return {region1, region2, region3, region4, regionFinal};
};

const idResolver = (o) => o.sport + o.year;

// Each sport, year combo is memoized since they never change
// Also the individual methods are also memoized based on their parameters
// The `scorer.score` is the slowest, but might as well do 'em all
module.exports = memoize((options) => {
  const sportYear = {
    sport: options.sport,
    year: options.year
  };
  const id = idResolver(sportYear);

  const {constants, regex, locks, bracket: bracketObj} = bracketData(sportYear);

  // // Make it easy to test when the app locks in 5 seconds
  // if (year === '2016') {
  //   locks = new Date(new Date().valueOf() + 5000).toJSON();
  // }

  const locked = () => new Date().toJSON() >= locks;

  const validator = new BracketValidator(sportYear);
  const updater = new BracketUpdater(sportYear);
  const generator = new BracketGenerator(sportYear);
  const scorer = new BracketScorer(sportYear);
  const getRegions = partial(getRegionsFor, constants.FINAL_ID, constants.REGION_IDS[0]);

  const boundValidator = validator.validate.bind(validator);
  const boundUpdater = updater.update.bind(updater);
  const boundGenerator = generator.generate.bind(generator);
  const boundScorer = scorer.score.bind(scorer);
  const boundDiff = scorer.diff.bind(scorer);

  return {
    regex,
    timeLeft: locks,
    isLocked: locked,
    bracket: bracketObj,
    emptyBracket: constants.EMPTY,
    totalGames: (constants.TEAMS_PER_REGION * constants.REGION_COUNT) - 1,
    unpickedChar: constants.UNPICKED_MATCH,

    // Dont memoize since it can be used to return a random bracket
    generate: boundGenerator,

    // Memoized by id plus the bracket argument
    validate: memoize((bracket) => getRegions(boundValidator(bracket)), (bracket) => id + bracket),

    // Memoized by id and the two brackets passed in
    diff: memoize((o) => getRegions(boundDiff(o)), (o) => id + o.master + o.entry),

    // Memoized by stringifying the options
    // TODO: use individual params since right now different ordered keys
    // will not hit the cache
    update: memoize(boundUpdater, (o) => id + JSON.stringify(o)),

    // Memoized by types (array), master (string), and entry (array)
    // Important: this only allows it to be used by passing the entry
    // as an array or string, not an object
    score: memoize(boundScorer, (types, o) =>
      id + types.join() + o.master + (typeof o.entry === 'string' ? o.entry : o.entry.join())
    )
  };
}, idResolver);

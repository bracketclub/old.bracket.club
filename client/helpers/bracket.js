'use strict';

const memo = require('lodash/function/memoize');
const find = require('lodash/collection/find');
const pluck = require('lodash/collection/pluck');
const partial = require('lodash/function/partial');

const BracketUpdater = require('bracket-updater');
const BracketGenerator = require('bracket-generator');
const BracketValidator = require('bracket-validator');
const BracketData = require('bracket-data');
const BracketScorer = require('bracket-scorer');

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

const idResolver = (options) => options.sport + options.year;

// Each sport, year combo is memoized since they never change
// Also the individual methods are also memoized based on their parameters
// The `scorer.score` is the slowest, but might as well do 'em all
module.exports = memo((sportYearOptions) => {
  const {sport, year} = sportYearOptions;
  const id = idResolver(sportYearOptions);

  const {constants, regex, locks, bracket: bracketObj} = new BracketData({
    props: ['constants', 'locks', 'regex', 'bracket'],
    sport,
    year
  });

    // // Make it easy to test when the app locks in 5 seconds
    // if (year === '2015') {
    //     locks = new Date(new Date().valueOf() + 5000).toJSON();
    // }

  const locked = () => new Date().toJSON() >= locks;

  const validator = new BracketValidator({sport, year});
  const updater = new BracketUpdater({sport, year});
  const generator = new BracketGenerator({sport, year});
  const scorer = new BracketScorer({sport, year});
  const getRegions = partial(getRegionsFor, constants.FINAL_ID, constants.REGION_IDS[0]);

  const boundValidator = validator.validate.bind(validator);
  const boundUpdater = updater.update.bind(updater);
  const boundGenerator = generator.generate.bind(generator);
  const boundScorer = scorer.score.bind(scorer);
  const boundDiff = scorer.diff.bind(scorer);

  return {
    regex, locks, locked,
    bracket: bracketObj,
    emptyBracket: constants.EMPTY,
    totalGames: (constants.TEAMS_PER_REGION * constants.REGION_COUNT) - 1,
    unpickedChar: constants.UNPICKED_MATCH,

    // Dont memoize since it can be used to return a random bracket
    generate: boundGenerator,

    // Memoized by id plus the bracket argument
    validate: memo((bracket) => getRegions(boundValidator(bracket)), (bracket) => id + bracket),

    // Memoized by id and the two brackets passed in
    diff: memo((options) => getRegions(boundDiff(options)), (options) => id + options.master + options.entry),

    // Memoized by stringifying the options
    // TODO: use individual params since right now different ordered keys
    // will not hit the cache
    update: memo(boundUpdater, (options) =>
      id + JSON.stringify(options)
    ),

    // Memoized by types (array), master (string), and entry (array)
    // Important: this only allows it to be used by passing the entry
    // as an array or string, not an object
    score: memo(boundScorer, (types, options) =>
      id + types.join() + options.master + (typeof options.entry === 'string' ? options.entry : options.entry.join())
    )
  };
}, idResolver);

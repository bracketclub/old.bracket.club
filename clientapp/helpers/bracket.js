let memo = require('lodash/function/memoize');
let find = require('lodash/collection/find');
let pluck = require('lodash/collection/pluck');
let partial = require('lodash/function/partial');
let flow = require('lodash/function/flow');

let BracketUpdater = require('bracket-updater');
let BracketGenerator = require('bracket-generator');
let BracketValidator = require('bracket-validator');
let BracketData = require('bracket-data');
let BracketScorer = require('bracket-scorer');

// These help format validated brackets and scored brackets into a normalized
// object for use by our views
let findNextRegion = (bracket, regions) => {
    return find(bracket, (region) => {
        return pluck(regions, 'id').indexOf(region.id) === -1;
    });
};

let getRegionsFor = (finalId, firstId, bracket) => {
    if (bracket instanceof Error) {
        throw bracket;
    }

    let regionFinal = bracket[finalId];
    let region1 = bracket[firstId];
    let region2 = bracket[region1.sameSideAs];
    let region3 = findNextRegion(bracket, [region1, region2, regionFinal]);
    let region4 = bracket[region3.sameSideAs];

    return {region1, region2, region3, region4, regionFinal};
};

let idResolver = (options) => {
    return options.sport + options.year;
};


// Each sport, year combo is memoized since they never change
// Also the individual methods are also memoized based on their parameters
// The `scorer.score` is the slowest, but might as well do 'em all
module.exports = memo(function getBracketHelpers(options) {
    let {sport, year} = options;
    let id = idResolver(options);

    let {constants, regex, locks, bracket} = new BracketData({
        props: ['constants', 'locks', 'regex', 'bracket'],
        sport,
        year
    });

    let validator = new BracketValidator({sport, year});
    let updater = new BracketUpdater({sport, year});
    let generator = new BracketGenerator({sport, year});
    let scorer = new BracketScorer({sport, year});
    let getRegions = partial(getRegionsFor, constants.FINAL_ID, constants.REGION_IDS[0]);

    let boundValidator = validator.validate.bind(validator);
    let boundUpdater = updater.update.bind(updater);
    let boundGenerator = generator.generate.bind(generator);
    let boundScorer = scorer.score.bind(scorer);
    let boundDiff = scorer.diff.bind(scorer);

    return {
        bracket, regex, locks,
        emptyBracket: constants.EMPTY,
        totalGames: (constants.TEAMS_PER_REGION * constants.REGION_COUNT) - 1,
        unpickedChar: constants.UNPICKED_MATCH,

        // Dont memoize since it can be used to return a random bracket
        generate: boundGenerator,

        // Memoized by id plus the bracket argument
        validate: memo(flow(boundValidator, getRegions), bracket => id + bracket),

        // Memoized by id and the two brackets passed in
        diff: memo(flow(boundDiff, getRegions), options =>
            id + options.master + options.entry
        ),

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

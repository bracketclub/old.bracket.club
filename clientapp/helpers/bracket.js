let memo = require('lodash/function/memoize');
let find = require('lodash/collection/find');
let pluck = require('lodash/collection/pluck');
let partial = require('lodash/function/partial');
let ary = require('lodash/function/ary');
let toArray = require('lodash/lang/toArray');

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
        return Error;
    }

    let regionFinal = bracket[finalId];
    let region1 = bracket[firstId];
    let region2 = bracket[region1.sameSideAs];
    let region3 = findNextRegion(bracket, [region1, region2, regionFinal]);
    let region4 = bracket[region3.sameSideAs];

    return {region1, region2, region3, region4, regionFinal};
};

let jsonResolver = function () {
    return toArray(arguments).map(ary(JSON.stringify, 1)).join('-');
};

// Each sport, year combo is memoized since they never change
// Also the individual methods are also memoized based on their parameters
// The `scorer.score` is the slowest, but might as well do 'em all
module.exports = memo(function getBracketHelpers(options) {
    let {sport, year} = options;
    let idResolver = partial(jsonResolver, sport + year);

    let {constants, regex, locks} = new BracketData({
        props: ['constants', 'locks', 'regex'],
        sport,
        year
    });
    let validator = new BracketValidator({sport, year});
    let updater = new BracketUpdater({sport, year});
    let generator = new BracketGenerator({sport, year});
    let scorer = new BracketScorer({sport, year});
    let getRegions = partial(getRegionsFor, constants.FINAL_ID, constants.REGION_IDS[0]);

    return {
        regex,
        locks,
        emptyBracket: constants.EMPTY,
        totalGames: (constants.TEAMS_PER_REGION * constants.REGION_COUNT) - 1,
        unpickedChar: constants.UNPICKED_MATCH,

        // Dont memoize since it is used to return a random bracket
        generate: generator.generate.bind(generator),

        validate: memo(function () {
            return getRegions(validator.validate.apply(validator, arguments));
        }, idResolver),

        update: memo(updater.update.bind(updater), idResolver),
        scoreDiff: memo(function () {
            return getRegions(scorer.diff.apply(scorer, arguments));
        }, idResolver),

        // Takes an array and an object so string both and concat together
        score: memo(scorer.score.bind(scorer), idResolver)
    };
}, function (options) {
    return options.sport + options.year;
});

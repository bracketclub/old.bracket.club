let globalDataStore = require('../stores/globalDataStore');
let find = require('lodash/collection/find');
let pluck = require('lodash/collection/pluck');

let findNextRegion = (bracket, regions) => {
    return find(bracket, (region) => {
        return pluck(regions, 'id').indexOf(region.id) === -1;
    });
};
let getRegions = (bracket) => {
    let {constants} = globalDataStore.getState().bracketData;
    let {FINAL_ID, REGION_IDS} = constants;

    if (bracket instanceof Error) {
        throw bracket;
    }

    let regionFinal = bracket[FINAL_ID];
    let region1 = bracket[REGION_IDS[0]];
    let region2 = bracket[region1.sameSideAs];
    let region3 = findNextRegion(bracket, [region1, region2, regionFinal]);
    let region4 = bracket[region3.sameSideAs];

    return {region1, region2, region3, region4, regionFinal};
};


module.exports = {
    getEntry () {
        let {validator} = globalDataStore.getState();
        return getRegions(validator.validate(this.props.bracket));
    },

    getUser () {
        let {scorer} = globalDataStore.getState();
        let {bracket: master} = this.props;
        let entry = this.props.user.bracket;
        return getRegions(scorer.diff({master, entry}));
    }
};
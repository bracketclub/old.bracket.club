let React = require('react');
let find = require('lodash/collection/find');
let pluck = require('lodash/collection/pluck');
let findNextRegion = function (bracket, regions) {
    return find(bracket, (region) => {
        return pluck('id', regions).indexOf(region.id) === -1;
    });
};


let Bracket = require('./Bracket');
let BracketNav = require('./Nav');
let BracketProgress = require('./Progress');
let ScoreCard = require('./ScoreCard');

let globalDataStore = require('../../stores/globalDataStore');


module.exports = React.createClass({
    getBracket () {
        let {bracketData, validator} = globalDataStore.getState();
        let {constants} = bracketData;
        let {FINAL_ID, REGION_IDS} = constants;

        let bracket = validator.validate(this.props.bracket);
        let regionFinal = bracket[FINAL_ID];
        let region1 = bracket[REGION_IDS[0]];
        let region2 = bracket[region1.sameSideAs];
        let region3 = findNextRegion(bracket, [region1, region2, regionFinal]);
        let region4 = bracket[region3.sameSideAs];

        return {region1, region2, region3, region4, regionFinal};
    },
    isEntry () {
        return !this.props.user;
    },
    render () {
        let props = this.props;
        return (<div>
            <BracketNav locked={props.locked} history={props.history} index={props.index} />
            <BracketProgress bracket={props.bracket} progressText='picks made' />
            {this.isEntry() ? null : <ScoreCard {...props.user} />}
            <Bracket locked={props.locked} bracket={this.getBracket()} />
        </div>);
    }
});

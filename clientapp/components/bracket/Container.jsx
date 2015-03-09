let React = require('react');

let globalDataStore = require('../../stores/globalDataStore');

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

let Bracket = require('./Bracket');
let BracketNav = require('./Nav');
let BracketProgress = require('./Progress');
let ScoreCard = require('./ScoreCard');


let BracketContainer = React.createClass({
    componentWillMount() {
        globalDataStore.listen(this.onChange);
    },

    componentWillUnmount () {
        globalDataStore.unlisten(this.onChange);
    },

    getInitialState () {
        return this.getBracketObject(this.props);
    },

    getBracketObject (props) {
        return {bracketObject: !props.entry ? this.getEntry(props) : this.getUser(props)};
    },

    componentWillReceiveProps (nextProps) {
        this.setState(this.getBracketObject(nextProps));
    },

    onChange () {
        this.setState(this.getInitialState());
    },

    getEntry (props) {
        let {validator} = globalDataStore.getState();
        return getRegions(validator.validate(props.bracket));
    },

    getUser (props) {
        let {scorer} = globalDataStore.getState();
        let {bracket: master} = props;
        let entry = props.entry.bracket;
        return getRegions(scorer.diff({master, entry}));
    },

    render () {
        let props = this.props;
        return (<div>
            <BracketNav locked={props.locked} history={props.history} index={props.index} />
            <BracketProgress bracket={props.bracket} />
            {this.props.entry ? <ScoreCard {...props.entry} master={props.bracket} /> : null}
            <Bracket locked={props.locked} bracket={this.state.bracketObject} />
        </div>);
    }
});

module.exports = BracketContainer;

'use strict';

let React = require('react');
let {PropTypes} = React;
let ListenerMixin = require('alt/mixins/ListenerMixin');

let FourOhFour = require('./FourOhFour');
let Bracket = require('../components/bracket/Container');

let bracketHelpers = require('../helpers/bracket');
let masterStore = require('../stores/masterStore');


let CreatedEntry = React.createClass({
    mixins: [ListenerMixin],

    contextTypes: {
        router: React.PropTypes.func
    },

    propTypes: {
        sport: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired,
        locked: PropTypes.bool
    },

    getInitialState () {
        let {history, index} = masterStore.getState();
        return {
            index,
            historyByYear: history,
            bracket: this.context.router.getCurrentParams().bracket
        };
    },

    componentWillReceiveProps () {
        this.setState(this.getInitialState());
    },

    componentDidMount () {
        this.listenTo(masterStore, this.onChange);
    },

    onChange () {
        this.setState(this.getInitialState());
    },

    render () {
        let {sport, year, locked} = this.props;
        let {bracket, historyByYear, index} = this.state;
        let {regex} = bracketHelpers({sport, year});

        if (!regex.test(bracket)) {
            return <FourOhFour />;
        }

        return <Bracket {...this.props} history={historyByYear[year]} index={index} entry={{bracket}} locked={true} showEntryMessage={!locked} />;
    }
});

module.exports = CreatedEntry;


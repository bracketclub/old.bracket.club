let React = require('react');
let {PropTypes} = React;
let {State} = require('react-router');
let ListenerMixin = require('alt/mixins/ListenerMixin');

let FourOhFour = require('./FourOhFour');
let Bracket = require('../components/bracket/Container');

let bracketHelpers = require('../helpers/bracket');
let masterStore = require('../stores/masterStore');


let CreatedEntry = React.createClass({
    mixins: [State, ListenerMixin],

    propTypes: {
        sport: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired
    },

    getInitialState () {
        let {history, index} = masterStore.getState();
        return {
            history, index,
            bracket: this.getParams().bracket
        };
    },

    componentWillReceiveProps () {
        this.setState(this.getInitialState());
    },

    componentDidMount() {
        this.listenTo(masterStore, this.onChange);
    },

    onChange () {
        this.setState(this.getInitialState());
    },

    render () {
        let {sport, year, locked} = this.props;
        let {bracket, history: historyByYear, index} = this.state;
        let {regex} = bracketHelpers({sport, year});

        if (!regex.test(bracket)) {
            return <FourOhFour />;
        }

        let history = historyByYear[year];
        let master = history[index];
        let bracketObj = bracketHelpers({sport, year}).diff({master, entry: bracket});

        let bracketProps = {
            sport,
            year,
            bracketObj,
            bracket,
            master,
            history,
            index,
            locked,
            isLiveEntry: true,
            entry: {sport, year, bracket}
        };

        return <Bracket {...bracketProps} />;
    }
});

module.exports = CreatedEntry;


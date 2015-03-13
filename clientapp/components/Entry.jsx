let React = require('react');
let {PropTypes} = React;
let ListenerMixin = require('alt/mixins/ListenerMixin');

let Bracket = require('./bracket/Container');

let bracketHelpers = require('../helpers/bracket');
let bracketEntryStore = require('../stores/bracketEntryStore');


let Entry = React.createClass({
    mixins: [ListenerMixin],

    propTypes: {
        sport: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired,
        locked: PropTypes.bool.isRequired
    },

    componentDidMount() {
        this.listenTo(bracketEntryStore, this.onChange);
    },

    getInitialState () {
        return bracketEntryStore.getState();
    },

    onChange () {
        this.setState(this.getInitialState());
    },

    render () {
        let {history, index} = this.state;
        let {sport, year, locked} = this.props;

        let bracket = history[index];
        let bracketObj = bracketHelpers({sport, year}).validate(bracket);

        let bracketProps = {
            sport,
            year,
            bracketObj,
            bracket,
            locked,
            history,
            index
        };

        return <Bracket {...bracketProps} />;
    }
});

module.exports = Entry;
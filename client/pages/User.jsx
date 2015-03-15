let React = require('react');
let {PropTypes} = React;
let {State} = require('react-router');
let ListenerMixin = require('alt/mixins/ListenerMixin');

let Bracket = require('../components/bracket/Container');
let UserNotFound = require('../components/UserNotFound');
let UserEntries = require('../components/UserEntries');

let masterStore = require('../stores/masterStore');
let entryStore = require('../stores/entryStore');

let bracketHelpers = require('../helpers/bracket');


let UserEntry = React.createClass({
    mixins: [State, ListenerMixin],

    propTypes: {
        sport: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired
    },

    componentDidMount() {
        this.listenTo(masterStore, this.onChange);
        this.listenTo(entryStore, this.onChange);
    },

    onChange () {
        this.setState(this.getInitialState());
    },

    getInitialState () {
        let {entries, users} = entryStore.getState();
        let {history, index} = masterStore.getState();
        let {id} = this.getParams();
        return {history, index, entries, users, id};
    },

    componentWillReceiveProps () {
        this.setState(this.getInitialState());
    },

    render () {
        let {sport, year} = this.props;
        let {
            id,
            users,
            index,
            history: historyByYear,
            entries: entriesByYear
        } = this.state;

        let history = historyByYear[year];
        let master = historyByYear[year][index];
        let user = users[id];
        let entry = entriesByYear[year][id];

        if (!user) {
            return <UserNotFound year={year} />;
        }

        if (user && !entry) {
            return <UserEntries {...user} year={year} />;
        }

        let bracket = entry.bracket;
        let bracketObj = bracketHelpers({sport, year}).diff({master, entry: bracket});

        let bracketProps = {
            sport,
            year,
            bracketObj,
            bracket,
            history,
            index,
            master,
            entry
        };

        return <Bracket {...bracketProps} locked={true} />;
    }
});

module.exports = UserEntry;

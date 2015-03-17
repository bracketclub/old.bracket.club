let React = require('react');
let {PropTypes} = React;
let {State} = require('react-router');
let ListenerMixin = require('alt/mixins/ListenerMixin');

let Bracket = require('../components/bracket/Container');
let UserNotFound = require('../components/user/NotFound');
let UserEntries = require('../components/user/Entries');

let masterStore = require('../stores/masterStore');
let entryStore = require('../stores/entryStore');


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
        let {year} = this.props;
        let {
            id, users, index,
            history: historyByYear,
            entries: entriesByYear
        } = this.state;

        let history = historyByYear[year];
        let user = users[id];
        let entry = entriesByYear[year][id];

        if (!user) {
            return <UserNotFound year={year} />;
        }

        if (user && !entry) {
            return <UserEntries {...user} year={year} />;
        }

        return <Bracket {...this.props} history={history} index={index} entry={entry} locked={true} />;
    }
});

module.exports = UserEntry;

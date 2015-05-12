'use strict';

let React = require('react');
let {PropTypes} = React;
let ListenerMixin = require('alt/mixins/ListenerMixin');

let Loading = require('../components/Loading');
let Bracket = require('../components/bracket/Container');
let UserNotFound = require('../components/user/NotFound');
let UserEntries = require('../components/user/Entries');

let masterStore = require('../stores/masterStore');
let entryStore = require('../stores/entryStore');


let UserEntry = React.createClass({
    mixins: [ListenerMixin],

    contextTypes: {
        router: React.PropTypes.func
    },

    propTypes: {
        sport: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired
    },

    componentDidMount () {
        this.listenTo(masterStore, this.onChange);
        this.listenTo(entryStore, this.onChange);
    },

    onChange () {
        this.setState(this.getInitialState());
    },

    getInitialState () {
        let {entries, users, loading: entryLoading} = entryStore.getState();
        let {history, index, loading: masterLoading} = masterStore.getState();
        let {id} = this.context.router.getCurrentParams();
        return {history, index, entries, users, id, loading: entryLoading || masterLoading};
    },

    componentWillReceiveProps () {
        this.setState(this.getInitialState());
    },

    render () {
        let {year} = this.props;
        let {
            id, users, index, loading,
            history: historyByYear,
            entries: entriesByYear
        } = this.state;

        let history = historyByYear[year];
        let user = users[id];
        let entry = entriesByYear[year][id];

        if (loading) {
            return <Loading />;
        }

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

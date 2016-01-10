'use strict';

const React = require('react');
const {PropTypes} = React;
const ListenerMixin = require('alt/mixins/ListenerMixin');

const Loading = require('../components/Loading');
const Bracket = require('../components/bracket/Container');
const UserNotFound = require('../components/user/NotFound');
const UserEntries = require('../components/user/Entries');

const masterStore = require('../stores/masterStore');
const entryStore = require('../stores/entryStore');

const UserEntry = React.createClass({
  mixins: [ListenerMixin],

  contextTypes: {
    router: React.PropTypes.func
  },

  propTypes: {
    sport: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired
  },

  componentDidMount() {
    this.listenTo(masterStore, this.onChange);
    this.listenTo(entryStore, this.onChange);
  },

  onChange() {
    this.setState(this.getInitialState());
  },

  getInitialState() {
    const {entries, users, loading: entryLoading} = entryStore.getState();
    const {history, index, loading: masterLoading} = masterStore.getState();
    const {id} = this.context.router.getCurrentParams();
    return {history, index, entries, users, id, loading: entryLoading || masterLoading};
  },

  componentWillReceiveProps() {
    this.setState(this.getInitialState());
  },

  render() {
    const {year} = this.props;
    const {
      id, users, index, loading,
      history: historyByYear,
      entries: entriesByYear
    } = this.state;

    const history = historyByYear[year];
    const user = users[id];
    const entry = entriesByYear[year][id];

    if (loading) {
      return <Loading />;
    }

    if (!user) {
      return <UserNotFound year={year} />;
    }

    if (user && !entry) {
      return <UserEntries {...user} year={year} />;
    }

    return (
      <Bracket
        {...this.props}
        history={history}
        index={index}
        entry={entry}
        locked
      />
    );
  }
});

module.exports = UserEntry;

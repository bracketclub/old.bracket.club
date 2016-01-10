'use strict';

const React = require('react');
const {PropTypes} = React;
const ListenerMixin = require('alt/mixins/ListenerMixin');

const Loading = require('../components/Loading');
const UserNotFound = require('../components/user/NotFound');
const UserEntries = require('../components/user/Entries');

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
    this.listenTo(entryStore, this.onChange);
  },

  getInitialState() {
    const {users, loading} = entryStore.getState();
    const {id} = this.context.router.getCurrentParams();
    return {user: users[id], loading};
  },

  componentWillReceiveProps() {
    this.setState(this.getInitialState());
  },

  onChange() {
    this.setState(this.getInitialState());
  },

  render() {
    const {year} = this.props;
    const {user, loading} = this.state;

    if (loading) {
      return <Loading />;
    }

    if (!user) {
      return <UserNotFound year={year} />;
    }

    return <UserEntries {...user} />;
  }
});

module.exports = UserEntry;

'use strict';

const React = require('react');
const {PropTypes} = React;
const ListenerMixin = require('alt/mixins/ListenerMixin');

const FourOhFour = require('./FourOhFour');
const Bracket = require('../components/bracket/Container');

const bracketHelpers = require('../helpers/bracket');
const masterStore = require('../stores/masterStore');

const CreatedEntry = React.createClass({
  mixins: [ListenerMixin],

  contextTypes: {
    router: React.PropTypes.func
  },

  propTypes: {
    sport: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    locked: PropTypes.bool
  },

  getInitialState() {
    const {history, index} = masterStore.getState();
    return {
      index,
      historyByYear: history,
      bracket: this.context.router.getCurrentParams().bracket
    };
  },

  componentWillReceiveProps() {
    this.setState(this.getInitialState());
  },

  componentDidMount() {
    this.listenTo(masterStore, this.onChange);
  },

  onChange() {
    this.setState(this.getInitialState());
  },

  render() {
    const {sport, year, locked} = this.props;
    const {bracket, historyByYear, index} = this.state;
    const {regex} = bracketHelpers({sport, year});

    if (!regex.test(bracket)) {
      return <FourOhFour />;
    }

    return (
      <Bracket
        {...this.props}
        history={historyByYear[year]}
        index={index}
        entry={{bracket}}
        locked
        showEntryMessage={!locked}
      />
    );
  }
});

module.exports = CreatedEntry;


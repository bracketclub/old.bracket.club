'use strict';

const React = require('react');
const ListenerMixin = require('alt/mixins/ListenerMixin');
const raf = require('raf');

const FourOhFour = require('./FourOhFour');
const Bracket = require('../components/bracket/Container');

const {rYear} = require('../global');
const bracketHelpers = require('../helpers/bracket');

const bracketEntryActions = require('../actions/bracketEntryActions');
const bracketEntryStore = require('../stores/bracketEntryStore');
const masterStore = require('../stores/masterStore');

window.crohn = () => {
  bracketEntryActions.generate('random');
  raf(window.crohn);
  return 'So brave. Now just Tweet Your Bracket!';
};

module.exports = React.createClass({
  mixins: [ListenerMixin],

  contextTypes: {
    router: React.PropTypes.func
  },

  propTypes: {
    sport: React.PropTypes.string.isRequired,
    year: React.PropTypes.string.isRequired,
    locked: React.PropTypes.bool
  },

  componentDidMount() {
    // Update store to contain the bracket from the url
    // Note: store protects against falsy and bad values
    bracketEntryActions.updateBracket(this.context.router.getCurrentParams().path);
    this.listenTo(bracketEntryStore, this.onChange);
    this.listenTo(masterStore, this.onChange);
  },

  onChange() {
    this.setState(this.getInitialState());
  },

  getInitialState(props) {
    const {locked} = (props || this.props);
    const {history, index} = (locked ? masterStore : bracketEntryStore).getState();
    return {history, index, urlParam: this.context.router.getCurrentParams().path};
  },

  componentWillReceiveProps(nextProps) {
    this.setState(this.getInitialState(nextProps));
  },

  render() {
    const {locked, sport, year} = this.props;
    const {urlParam, history: stateHistory, index} = this.state;
    const {regex} = bracketHelpers({sport, year});

    // The landing page is a few things dependent on state & url:
    if (locked) {
      // A locked master bracket for a previous year
      return <Bracket {...this.props} history={stateHistory[year]} index={index} />;
    }
    else if (!urlParam || rYear.test(urlParam) || regex.test(urlParam)) {
      // The current unlocked entry
      return <Bracket {...this.props} history={stateHistory} index={index} />;
    }

    // A fallback url which will render the 404 for bad params
    return <FourOhFour />;
  }
});

'use strict';

const React = require('react');
const {PropTypes} = React;
const {RouteHandler} = require('react-router');
const ListenerMixin = require('alt/mixins/ListenerMixin');

const Header = require('./Header');
const Footer = require('./Footer');

const meStore = require('../../stores/meStore');
const globalDataStore = require('../../stores/globalDataStore');

const App = React.createClass({
  mixins: [ListenerMixin],

  propTypes: {
    fluid: PropTypes.bool.isRequired,
    sport: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      me: meStore.getState(),
      locked: globalDataStore.getState().locked
    };
  },

  componentDidMount() {
    this.listenTo(meStore, this.onChange);
    this.listenTo(globalDataStore, this.onChange);
  },

  onChange() {
    this.setState(this.getInitialState());
  },

  render() {
    const {me, locked} = this.state;
    const {year, sport, fluid} = this.props;
    const containerClass = fluid ? 'container-fluid' : 'container';
    return (
      <div>
        <Header year={year} me={me} />
        <div className={`${containerClass} main-container`}>
          <RouteHandler sport={sport} year={year} me={me} locked={locked} />
        </div>
        <Footer className={containerClass} me={me} />
      </div>
    );
  }
});

module.exports = App;

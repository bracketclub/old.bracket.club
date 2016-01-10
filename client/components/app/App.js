'use strict';

const React = require('react');
const {PropTypes} = React;
const ListenerMixin = require('alt/mixins/ListenerMixin');

const Header = require('./Header');
const Footer = require('./Footer');

const meStore = require('../../stores/meStore');
const globalDataStore = require('../../stores/globalDataStore');

const App = React.createClass({
  mixins: [ListenerMixin],

  getDefaultProps() {
    return {fluid: true, sport: 'ncaa-mens-basketball', year: '2015'};
  },

  propTypes: {
    fluid: PropTypes.bool,
    sport: PropTypes.string,
    year: PropTypes.string,
    children: PropTypes.node.isRequired
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
    const {year, sport, fluid, children} = this.props;
    const containerClass = fluid ? 'container-fluid' : 'container';
    console.log(children)
    return (
      <div>
        <Header year={year} me={me} />
        <div className={`${containerClass} main-container`}>
          {React.cloneElement(children, {sport, year, me, locked})}
        </div>
        <Footer className={containerClass} me={me} />
      </div>
    );
  }
});

module.exports = App;

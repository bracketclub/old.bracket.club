'use strict';

const React = require('react');
const {PropTypes} = React;
const classNames = require('classnames');

const Affix = require('react-overlays/lib/Affix');

const BracketProgress = require('./Progress');
const EnterButton = require('./EnterButton');
const BracketNav = require('./Nav');

const BracketContainer = React.createClass({
  propTypes: {
    sport: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    locked: PropTypes.bool.isRequired,
    history: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired
  },

  render() {
    const {locked} = this.props;
    const cx = classNames({
      'two-columns': locked,
      'three-columns': !locked
    });
    const offsetTop = 51;
    return (
      <div className={`${cx} bracket-header`}>
        <Affix offsetTop={offsetTop}>
          <BracketNav {...this.props} />
          {!this.props.locked ? <EnterButton {...this.props} /> : null}
          <BracketProgress {...this.props} />
        </Affix>
      </div>
    );
  }
});

module.exports = BracketContainer;

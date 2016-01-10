'use strict';

const React = require('react');
const {PropTypes} = React;
const {PureRenderMixin} = require('react-pure-render/mixin');

const ProgressBar = require('react-bootstrap/lib/ProgressBar');
const bracketHelpers = require('../../helpers/bracket');

const BracketProgress = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    sport: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    locked: PropTypes.bool.isRequired,
    history: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired
  },

  render() {
    const {sport, year, locked, history, index} = this.props;
    const bracket = history[index];
    const {totalGames, unpickedChar} = bracketHelpers({sport, year});
    const progress = totalGames - (bracket.split(unpickedChar).length - 1);
    const label = `%(now)s of %(max)s ${locked ? 'games played' : 'picks made'}`;

    return (
      <div className='bracket-progress'>
        <ProgressBar
          striped
          now={progress}
          min={0}
          max={totalGames}
          label={label}
        />
      </div>
    );
  }
});

module.exports = BracketProgress;

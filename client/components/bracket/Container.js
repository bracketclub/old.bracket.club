'use strict';

const React = require('react');
const {PropTypes} = React;
const {Link} = require('react-router');

const Alert = require('react-bootstrap/lib/Alert');
const TimeAgo = require('react-timeago');

const Bracket = require('./Bracket');
const BracketHeader = require('./Header');
const ScoreCard = require('./ScoreCard');

const bracketHelpers = require('../../helpers/bracket');

const formatter = (value, unit) => {
  if (value !== 1) {
    unit += 's';
  }
  return `${value} ${unit}`;
};

const BracketContainer = React.createClass({
  propTypes: {
    sport: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    locked: PropTypes.bool.isRequired,
    history: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    entry: PropTypes.object,
    showEntryMessage: PropTypes.bool
  },

  getBracketObj() {
    const {entry, history, index, sport, year} = this.props;
    const bracket = history[index];
    const bracketHelper = bracketHelpers({sport, year});
    let bracketObj;

    if (entry) {
      bracketObj = bracketHelper.diff({master: bracket, entry: entry.bracket});
    }
    else {
      bracketObj = bracketHelper.validate(bracket);
    }

    return bracketObj;
  },

  render() {
    const {sport, year, entry, showEntryMessage, locked} = this.props;
    return (
      <div>
        <BracketHeader {...this.props} />
        {entry ? <ScoreCard {...this.props} {...entry} /> : null}
        {showEntryMessage || (entry && !locked)
          ? <Alert bsStyle='info'>
            Entries are still open for {year} for another <TimeAgo formatter={formatter} date={bracketHelpers({sport, year}).locks} />.
            Go to the <Link to='landing'>entry page</Link> to fill out your bracket before it's too late!
          </Alert>
          : null
        }
        <Bracket {...this.props} bracket={this.getBracketObj()} />
      </div>
    );
  }
});

module.exports = BracketContainer;

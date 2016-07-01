import React, {PropTypes, Component} from 'react';
import {chunk} from 'lodash';
import {findDOMNode} from 'react-dom';

import MotionScroll from 'lib/MotionScroll';
import Matchup from './Matchup';

export default class Rounds extends Component {
  static defaultProps = {
    name: '',
    rounds: []
  };

  static propTypes = {
    'final': PropTypes.bool,
    finalId: PropTypes.string,
    name: PropTypes.string.isRequired,
    rounds: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    onUpdate: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {scroll: 0};
  }

  componentWillReceiveProps(nextProps) {
    const {rounds: prevRounds} = this.props;
    const {rounds} = nextProps;
    const roundString = (round) => JSON.stringify(round, (k, v) => (v && v.seed) || v);

    let roundChange, roundFull;
    for (let i = 1, m = rounds.length; i < m; i++) {
      const round = roundString(rounds[i]);
      const prevRound = roundString(prevRounds[i]);

      // Rounds are marked as changed or full
      // Values are 1 based to make multiplying to get scroll position easier
      if (round !== prevRound) {
        // A game has changed in this round
        roundChange = i + 1;
        if (round.indexOf('null') === -1 && prevRound.indexOf('null') > -1) {
          // This round has just been filled
          roundFull = i + 1;
        }
        // Break here so only the first round with a change if calculated
        // This is important when changing a game where a team going further
        // in the tournament is removed from all later rounds
        break;
      }
    }

    if (roundChange || roundFull) {
      // TODO: dont read from the dom. Instead set up handlers to width in state
      const {offsetWidth: width} = findDOMNode(this.refs.scroller);
      const {scroll} = this.state;
      const step = width / 2; // 2 rounds fit at a time
      const visible = Math.round((scroll + width) / step);

      if (roundChange && roundChange > visible) {
        // Scroll to the round with the change if its not visible
        this.setScrollState((roundChange * step) - width);
      }
      else if (roundFull && roundFull === visible) {
        // Scroll to the next round if this round has just been filled
        this.setScrollState(((roundFull + 1) * step) - width);
      }
    }
  }

  setScrollState = (scroll) => {
    this.setState({scroll});
  };

  render() {
    const {id, onUpdate, rounds, finalId} = this.props;
    const {scroll} = this.state;

    return (
      <MotionScroll scroll={scroll} onScrollReset={this.setScrollState} ref='scroller'>
        <div className='rounds'>
          <div className='rounds-scroll'>
            {rounds.map((round, roundIndex) =>
              <div key={roundIndex} className='round'>
                {chunk(round, 2).map((matchup, matchupIndex) =>
                  <Matchup
                    key={matchupIndex}
                    fromRegion={id}
                    finalId={finalId}
                    matchup={matchup}
                    onUpdate={onUpdate}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </MotionScroll>
    );
  }
}

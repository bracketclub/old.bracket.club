import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MotionScroll from 'lib/MotionScroll';

export default class Rounds extends Component {
  static defaultProps = {
    rounds: []
  };

  static propTypes = {
    children: PropTypes.node.isRequired,
    rounds: PropTypes.array.isRequired
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
      const {offsetWidth: width} = this._scroller;
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

  setScrollNode = (node) => {
    const scroller = node.firstChild;
    this._scroller = scroller;
    return scroller;
  };

  render() {
    const {children} = this.props;
    const {scroll} = this.state;

    return (
      <MotionScroll scroll={scroll} onScrollReset={this.setScrollState} scrollNode={this.setScrollNode}>
        {children}
      </MotionScroll>
    );
  }
}

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Alert} from 'react-bootstrap';
import {chunk, pick, isEqual, flatten, compact, range, get, first, last} from 'lodash';

import RoundsScroller from './RoundsScroller';
import Pick from './Pick';
import DiffPick from './DiffPick';
import Team from './Team';
import styles from './index.less';

const isTeamEqual = (team1, team2) => isEqual(
  pick(team1, 'seed', 'name'),
  pick(team2, 'seed', 'name')
);

const MAX_ROUNDS = 6;

export default class Bracket extends Component {
  static defaultProps = {
    bracket: {}
  };

  static propTypes = {
    bracket: PropTypes.object,
    finalId: PropTypes.string,
    onUpdate: PropTypes.func,
    bestOf: PropTypes.object,
    diff: PropTypes.bool
  };

  renderTeam(team, {opponent, winner, top} = {}) {
    const {onUpdate, bestOf, diff} = this.props;
    const isWinner = isTeamEqual(team, winner);

    // Bracket is live so this is a pick that can be made
    if (onUpdate) {
      return (
        <Pick {...{onUpdate, bestOf, team, opponent, winner, isWinner, top}} />
      );
    }

    // Bracket is being scored
    if (diff) {
      return (
        <DiffPick {...{team, bestOf, picked: winner}} />
      );
    }

    // This is a master bracket game. It makes the most sense I think to show
    // the winsIn for both teams instead of the number of games the series went.
    // e.g. 4-2 instead of 6
    return (
      <Team {...team}>
        {bestOf && get(winner, 'winsIn') &&
          <span className={styles.winsIn}>{isWinner ? bestOf.wins : winner.winsIn - bestOf.wins}</span>
        }
      </Team>
    );
  }

  renderMatchup(matchup, {matchupIndex, rounds, round, roundIndex, final, regionOpponent, regionWinner}) {
    const {finalId} = this.props;
    const lastRound = roundIndex === rounds.length - 1;

    return (
      <div key={matchupIndex} className={styles.matchup}>
        {matchup.map((team, teamIndex) => {
          // Whether this team is on the top half of its region when it is cut
          // in half horizontally
          const verticalIndex = (matchupIndex * 2) + teamIndex;
          const top = verticalIndex < (round.length / 2);

          const opponent = lastRound ? regionOpponent : matchup[teamIndex === 0 ? 1 : 0];
          const winner = lastRound ? regionWinner : rounds[roundIndex + 1][matchupIndex];

          // If its the final or the last round of a region that game is now being picked
          // as a finalRegion game, so reassign the regions. This only affects live brackets
          if (finalId && (final || lastRound)) {
            if (team) team.fromRegion = finalId;
            if (opponent) opponent.fromRegion = finalId;
          }

          return (
            <div key={teamIndex} className={styles.teamBox}>
              {team
                ? this.renderTeam(team, {opponent, winner, top})
                : <Team />
              }
            </div>
          );
        })}
      </div>
    );
  }

  renderRegion(region, options) {
    const {rounds, id, name} = region;
    const {onUpdate} = this.props;

    // Assign a class indicating how many rounds are in the region
    const roundsClass = range(1, MAX_ROUNDS + 1).reduce((acc, index) => {
      acc[styles[`rounds${index}`]] = rounds.length === index;
      return acc;
    }, {});

    const regionClass = cx(styles.region, roundsClass, {
      [styles.regionTop]: options.top,
      [styles.regionBottom]: options.bottom
    });

    let title = name;
    if (onUpdate) {
      const games = flatten(rounds.slice(1));
      title += ` (${compact(games).length}/${games.length})`;
    }

    return (
      <div key={id} className={regionClass}>
        <h2 className={styles.title}>{title}</h2>
        <RoundsScroller rounds={rounds}>
          <div className={styles.roundsScroll}>
            <div className={styles.rounds}>
              {rounds.map((round, roundIndex) => (
                <div key={roundIndex} className={styles.round}>
                  {chunk(round, 2).map((matchup, matchupIndex) => this.renderMatchup(matchup, {
                    rounds,
                    round,
                    roundIndex,
                    matchupIndex,
                    ...pick(options, 'final', 'regionOpponent', 'regionWinner')
                  }))}
                </div>
              ))}
            </div>
          </div>
        </RoundsScroller>
      </div>
    );
  }

  render() {
    const {bracket} = this.props;

    if (!bracket) {
      return null;
    }

    if (bracket instanceof Error) {
      return (
        <Alert bsStyle='danger'>
          <h4>Whoa, something about that bracket doesn’t look right!</h4>
          <p>Could be that <strong>{bracket.message.toLowerCase().replace('.', '')}</strong>?</p>
        </Alert>
      );
    }

    const {regions: {left, right}, regionFinal} = bracket;
    const singleRegion = left.length === 1;
    const bracketClass = cx(styles.bracket, {[styles.singleRegion]: singleRegion});

    const regionOpponent = (side, index) => {
      const opposite = side === left ? right : left;
      // Single regions play the first (and only) region on the opposite side
      // Otherwise the winners play the other region on the same side
      const opponentRegion = singleRegion ? first(opposite) : side[index === 0 ? 1 : 0];
      // This is the first team of the last round
      return first(last(opponentRegion.rounds));
    };

    const regionWinner = (side) => {
      // Single regions only have two rounds in the final, so in that case the
      // region winner is the champion so the index is always 0.
      // Otherwise the left side is always the "top" of the final so that is
      // always the 0th index and the other side is the 1st
      // eslint-disable-next-line no-nested-ternary
      const finalIndex = singleRegion ? 0 : (side === left ? 0 : 1);
      return regionFinal.rounds[1][finalIndex];
    };

    return (
      <div className={bracketClass}>
        <div className={cx(styles.regions, styles.regionsLeft)}>
          {left.map((r, index, side) => this.renderRegion(r, {
            regionOpponent: regionOpponent(side, index),
            regionWinner: regionWinner(side),
            top: index === 0 && !singleRegion,
            bottom: index === 1 && !singleRegion
          }))}
        </div>
        <div className={cx(styles.regions, styles.regionsRight)}>
          {right.map((r, index, side) => this.renderRegion(r, {
            regionOpponent: regionOpponent(side, index),
            regionWinner: regionWinner(side),
            top: index === 0 && !singleRegion,
            bottom: index === 1 && !singleRegion
          }))}
        </div>
        <div className={cx(styles.regions, styles.regionsFinal)}>
          {this.renderRegion(regionFinal, {'final': true})}
        </div>
      </div>
    );
  }
}

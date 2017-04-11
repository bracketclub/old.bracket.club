import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Alert} from 'react-bootstrap';
import {chunk, pick, flatten, compact, range, get} from 'lodash';

import RoundsScroller from './RoundsScroller';
import Pick from './Pick';
import DiffPick from './DiffPick';
import Team from './Team';
import styles from './index.less';

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

  renderTeam(team, {opponent, winner} = {}) {
    const {onUpdate, bestOf, diff} = this.props;
    const isWinner = get(winner, 'seed') === get(team, 'seed') && get(team, 'seed') === get(team, 'seed');

    // Bracket is live so this is a pick that can be made
    if (onUpdate) {
      return (
        <Pick {...{onUpdate, bestOf, team, opponent, winner, isWinner}} />
      );
    }

    // Bracket is being scored
    if (diff) {
      return (
        <DiffPick {...{team, bestOf, picked: winner, wasPicked: isWinner}} />
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

  renderMatchup(matchup, {matchupIndex, rounds, roundIndex, final, otherRegion, finalRegion}) {
    const {finalId} = this.props;
    const lastRound = roundIndex === rounds.length - 1;

    return (
      <div key={matchupIndex} className={styles.matchup}>
        {matchup.map((team, teamIndex) => {
          // eslint-disable-next-line no-nested-ternary
          const opponent = lastRound ? (final ? null : otherRegion.rounds[roundIndex][0]) : matchup[teamIndex === 0 ? 1 : 0];
          // eslint-disable-next-line no-nested-ternary
          const winner = lastRound ? (final ? null : finalRegion.rounds[1][matchupIndex]) : rounds[roundIndex + 1][matchupIndex];

          // If its the final or the last round of a region that game is now being picked
          // as a finalRegion game, so reassign the regions. This only affects live brackets
          if (final || lastRound) {
            if (team) team.fromRegion = finalId;
            if (opponent) opponent.fromRegion = finalId;
          }

          return (
            <div key={teamIndex} className={styles.teamBox}>
              {team
                ? this.renderTeam(team, {opponent, winner})
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

    // TODO: final first round shouldBe are overlapping
    return (
      <div key={id} className={regionClass}>
        <h2 className={styles.title}>{title}</h2>
        <RoundsScroller rounds={rounds}>
          <div className={styles.roundsScroll}>
            <div className={styles.rounds}>
              {rounds.map((round, roundIndex) =>
                <div key={roundIndex} className={styles.round}>
                  {chunk(round, 2).map((matchup, matchupIndex) => this.renderMatchup(matchup, {
                    rounds,
                    round,
                    roundIndex,
                    matchupIndex,
                    ...pick(options, 'final', 'otherRegion', 'finalRegion')
                  }))}
                </div>
              )}
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

    const singleRegion = bracket.regions.left.length === 1;
    const bracketClass = cx(styles.bracket, {
      [styles.singleRegion]: singleRegion
    });

    return (
      <div className={bracketClass}>
        <div className={cx(styles.regions, styles.regionsLeft)}>
          {bracket.regions.left.map((r, index) => this.renderRegion(r, {
            otherRegion: singleRegion ? bracket.regions.right[0] : bracket.regions.left[index === 0 ? 1 : 0],
            top: index === 0 && !singleRegion,
            bottom: index === 1 && !singleRegion,
            finalRegion: bracket.regionFinal
          }))}
        </div>
        <div className={cx(styles.regions, styles.regionsRight)}>
          {bracket.regions.right.map((r, index) => this.renderRegion(r, {
            otherRegion: singleRegion ? bracket.regions.left[0] : bracket.regions.right[index === 0 ? 1 : 0],
            top: index === 0 && !singleRegion,
            bottom: index === 1 && !singleRegion,
            finalRegion: bracket.regionFinal
          }))}
        </div>
        <div className={cx(styles.regions, styles.regionsFinal)}>
          {this.renderRegion(bracket.regionFinal, {'final': true})}
        </div>
      </div>
    );
  }
}

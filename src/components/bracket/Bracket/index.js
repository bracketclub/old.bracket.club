import React, {PropTypes, Component} from 'react';
import cx from 'classnames';
import {Alert} from 'react-bootstrap';
import {chunk, pick, flatten, compact, range} from 'lodash';

import RoundsScroller from '../RoundsScroller';
import Pick from './Pick';
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
    bestOf: PropTypes.object
  };

  renderTeam(team, {opponent, winner} = {}) {
    const {onUpdate, bestOf} = this.props;
    const {seed, name, eliminated, correct, shouldBe} = team;

    // Bracket is live so this is a pick that can be made
    if (onUpdate) {
      return (
        <Pick {...{onUpdate, bestOf, team, opponent, winner}} />
      );
    }

    const entryTeamClasses = cx({
      [styles.eliminated]: eliminated,
      [styles.correct]: correct === true,
      [styles.incorrect]: correct === false
    });

    return [
      <div key={'team'} className={cx(styles.team, entryTeamClasses)} title={`${seed} ${name}`}>
        <span className={styles.seed}>{team.seed}</span>
        <span className={styles.name}>{team.name}</span>
      </div>,
      correct === false && shouldBe && (
        <div key={'should-be'} className={cx(styles.team, styles.shouldBe)} title={`${shouldBe.seed} ${shouldBe.text}`}>
          <span className={styles.seed}>{shouldBe.seed}</span>
          <span className={styles.name}>{shouldBe.name}</span>
        </div>
      )
    ];
  }

  renderMatchup(matchup, {matchupIndex, rounds, roundIndex, final, otherRegion, finalRegion}) {
    const {finalId} = this.props;
    const lastRound = roundIndex === rounds.length - 1;

    return (
      <div className={styles.matchup}>
        {matchup.map((team, teamIndex) => {
          const opponent = lastRound ? (!final && otherRegion.rounds[roundIndex][0]) : matchup[teamIndex === 0 ? 1 : 0];
          const winner = lastRound ? (!final && finalRegion.rounds[1][matchupIndex]) : rounds[roundIndex + 1][matchupIndex];
          if (final || lastRound) {
            if (team) team.fromRegion = finalId;
            if (opponent) opponent.fromRegion = finalId;
          }
          return (
            <div key={teamIndex} className={styles.teamBox}>
              {team ? this.renderTeam(team, {opponent, winner}) : <div className={styles.team}>{'\u00A0'}</div>}
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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {pick, isEqual} from 'lodash';
import Team from './Team';
import styles from './index.less';

const isTeamEqual = (team1, team2) => isEqual(
  pick(team1, 'seed', 'name'),
  pick(team2, 'seed', 'name')
);

export default class DiffPick extends Component {
  static propTypes = {
    bestOf: PropTypes.object,
    team: PropTypes.object,
    picked: PropTypes.object
  };

  render() {
    const {bestOf, team, picked} = this.props;
    const {eliminated, correct, shouldBe} = team;
    const teamWrong = correct === false;
    const showShouldBe = teamWrong && shouldBe;

    const entryTeamClasses = cx({
      [styles.eliminated]: eliminated,
      [styles.correct]: correct,
      [styles.incorrect]: teamWrong
    });

    if (!bestOf) {
      return [
        <Team key='team-1' className={entryTeamClasses} {...team} />,
        showShouldBe && <Team key='team-2' className={styles.shouldBe} {...shouldBe} />
      ];
    }

    const wasPicked = isTeamEqual(team, picked);
    const wasWinner = isTeamEqual(team, picked && picked.shouldBe);
    const showWinsIn = wasPicked || wasWinner;

    return [
      <Team key='team-1' className={entryTeamClasses} {...team}>
        {showWinsIn &&
          <span className={cx(styles.winsIn, styles.winsInDiff)}>
            {wasWinner && picked.winsInCorrect === false &&
              <span className={styles.winsInActual}>
                {picked.shouldBe.winsIn}
              </span>
            }
            {wasPicked &&
              <span
                className={cx({
                  [styles.winsInCorrect]: picked.winsInCorrect === true,
                  [styles.winsInIncorrect]: picked.winsInCorrect === false
                })}
              >
                {picked.winsIn}
              </span>
            }
          </span>
        }
      </Team>,
      showShouldBe && (
        <Team key='team-2' className={styles.shouldBe} {...shouldBe}>
          <span className={styles.winsIn}>{shouldBe.winsIn}</span>
        </Team>
      )
    ];
  }
}

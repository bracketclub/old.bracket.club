import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Team from './Team';
import styles from './index.less';

export default class DiffPick extends Component {
  static propTypes = {
    bestOf: PropTypes.object,
    team: PropTypes.object,
    picked: PropTypes.object,
    wasPicked: PropTypes.bool
  };

  render() {
    const {bestOf, team, picked, wasPicked} = this.props;
    const {eliminated, correct, shouldBe} = team;

    const incorrect = correct === false;
    const winsInIncorrect = team.winsInCorrect === false;

    const entryTeamClasses = cx({
      [styles.eliminated]: eliminated,
      [styles.correct]: correct,
      [styles.incorrect]: incorrect
    });

    return (
      <span>
        <Team className={entryTeamClasses} {...team}>
          {bestOf && wasPicked &&
            // The winsIn get displayed with the previous round
            // like on the live bracket
            <span className={styles.winsIn}>
              <span style={{textDecoration: picked.winsInCorrect === false ? 'line-through' : 'none'}}>{picked.winsIn}</span>
              {picked.winsInCorrect === false && ' '}
              {picked.winsInCorrect === false &&
                <span>{picked.shouldBe.winsIn}</span>
              }
            </span>
          }
        </Team>
        {!bestOf && incorrect && shouldBe &&
          // In a bracket without a bestOf then shouldBe only
          // gets displayed when it is an incorrect pick
          <Team className={styles.shouldBe} {...shouldBe} />
        }
        {bestOf && (incorrect || winsInIncorrect) && shouldBe &&
          // When a bracket has a bestOf, then either the pick or winsIn being
          // incorrect will display this text
          // TODO: better colors to show which parts are correct and incorrect
          <Team className={styles.shouldBe} {...shouldBe}>
            <span
              className={cx(styles.winsIn, {
                [styles.winsInIncorrect]: correct && winsInIncorrect
              })}
            >
              {shouldBe.winsIn}
            </span>
          </Team>
        }
      </span>
    );
  }
}

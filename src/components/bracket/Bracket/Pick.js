import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Dropdown, MenuItem} from 'react-bootstrap';
import {pick, get} from 'lodash';

import Team from './Team';
import styles from './index.less';

export default class Pick extends Component {
  static propTypes = {
    onUpdate: PropTypes.func,
    bestOf: PropTypes.object,
    team: PropTypes.object,
    opponent: PropTypes.object,
    winner: PropTypes.object,
    isWinner: PropTypes.bool
  };

  render() {
    const {onUpdate, bestOf, team, opponent, winner, isWinner} = this.props;

    // This is a clickable team because there's an onUpdate function
    // and a team currently in this slot
    const handler = (e, {winsIn} = {}) => {
      const update = {
        fromRegion: team.fromRegion,
        winner: pick(team, 'seed', 'name')
      };

      if (winsIn) {
        update.playedCompetitions = winsIn;
      }

      if (opponent) {
        update.loser = pick(opponent, 'seed', 'name');
      }

      onUpdate(update);
    };

    if (bestOf) {
      return (
        <Dropdown className={styles.teamDropdown} id='wins-in-dropdown'>
          <Team bsRole='toggle' className={cx(styles.team, styles.pickable)} {...team}>
            {isWinner && get(winner, 'winsIn') &&
              <span className={styles.winsIn}>{winner.winsIn}</span>
            }
          </Team>
          <Dropdown.Menu>
            {bestOf.range.map((winsIn) => (
              <MenuItem key={winsIn} eventKey={winsIn} onClick={(e) => handler(e, {winsIn})}>{winsIn}</MenuItem>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      );
    }

    return (
      <Team className={cx(styles.team, styles.pickable)} onClick={handler} {...team} />
    );
  }
}

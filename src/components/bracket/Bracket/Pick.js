import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Dropdown, MenuItem, SafeAnchor} from 'react-bootstrap';
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
    isWinner: PropTypes.bool,
    top: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false
    };
  }

  onToggle = (isOpen) => {
    this.setState({
      dropdownOpen: isOpen
    });
  }

  render() {
    const {onUpdate, bestOf, team, opponent, winner, isWinner, top} = this.props;
    const {dropdownOpen} = this.state;

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
      const menuClass = cx(styles.seriesMenu, {
        [styles.seriesMenuOpen]: dropdownOpen,
        [styles.seriesMenuUp]: !top
      });

      return (
        <Dropdown className={styles.seriesPicker} open={dropdownOpen} onToggle={this.onToggle} id='wins-in-dropdown'>
          <Team bsRole='toggle' className={cx(styles.team, styles.pickable)} {...team}>
            {isWinner && get(winner, 'winsIn') &&
              <span className={styles.winsIn}>{winner.winsIn}</span>
            }
          </Team>
          <Dropdown.Menu className={menuClass}>
            {bestOf.range.map((winsIn) => (
              <MenuItem
                className={styles.seriesItem}
                key={winsIn}
                eventKey={winsIn}
                onClick={(e) => handler(e, {winsIn})}
                componentClass={(props) => <SafeAnchor {...props} className={styles.seriesItemInner} />}
              >
                {winsIn}
              </MenuItem>
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

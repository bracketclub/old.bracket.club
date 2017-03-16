import React, {PropTypes, Component} from 'react';
import cx from 'classnames';
import {Dropdown, MenuItem} from 'react-bootstrap';
import {pick, omit} from 'lodash';

import styles from './index.less';

class CustomToggle extends React.Component {
  static propTypes = {
    onClick: PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onClick(e);
  }

  render() {
    const props = omit(this.props, 'bsRole');
    return (
      <a onClick={this.handleClick} {...props} />
    );
  }
}

export default class Pick extends Component {
  static propTypes = {
    onUpdate: PropTypes.func,
    bestOf: PropTypes.object,
    team: PropTypes.object,
    opponent: PropTypes.object,
    winner: PropTypes.object
  };

  teamText(team) {
    const {seed, name, series} = team || {};
    if (!seed || !name) return '';
    return `${seed} ${name}${typeof series === 'number' ? ` (${series})` : ''}`;
  }

  render() {
    // console.group()
    // this.props.team && console.log(this.props.team.seed, this.props.team.name, this.props.team.fromRegion)
    // this.props.opponent && console.log(this.props.opponent.seed, this.props.opponent.name, this.props.opponent.fromRegion)
    // this.props.winner && console.log(this.props.winner.seed, this.props.winner.name, this.props.winner.fromRegion)
    // console.groupEnd()

    const {onUpdate, bestOf, team, opponent, winner} = this.props;

    // This is a clickable team because there's an onUpdate function
    // and a team currently in this slot
    const handler = (winsIn) => {
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

    if (bestOf.range) {
      const isWinner = winner && (winner.seed === team.seed && winner.name === team.name);
      return (
        <Dropdown className={styles.teamDropdown}>
          <CustomToggle bsRole='toggle' className={cx(styles.team, styles.pickable)} title={`${team.seed} ${team.name}`}>
            <span className={styles.seed}>{team.seed}</span>
            <span className={styles.name}>{team.name}</span>
            {isWinner && winner.winsIn &&
              <span className={styles.winsIn}>{winner.winsIn}</span>
            }
          </CustomToggle>
          <Dropdown.Menu>
            {bestOf.range.map((winsIn) => (
              <MenuItem key={winsIn} eventKey={winsIn} onClick={() => handler(winsIn)}>{winsIn}</MenuItem>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      );
    }

    return (
      <a className={cx(styles.team, styles.pickable)} onClick={() => handler()} title={`${team.seed} ${team.name}`}>
        <span className={styles.seed}>{team.seed}</span>
        <span className={styles.name}>{team.name}</span>
      </a>
    );
  }
}

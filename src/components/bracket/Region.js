import React, {PropTypes, Component} from 'react';
import classNames from 'classnames';
import {flatten, compact} from 'lodash';

import Rounds from './Rounds';

export default class Region extends Component {
  static defaultProps = {
    name: '',
    rounds: []
  };

  static propTypes = {
    'final': PropTypes.bool,
    name: PropTypes.string.isRequired,
    rounds: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    onUpdate: PropTypes.func
  };

  render() {
    const {final, name, id, onUpdate, rounds} = this.props;

    const regionClasses = classNames('region', {
      'final-region': final,
      'initial-region': !final
    });

    let unpicked = '';

    if (onUpdate) {
      const games = flatten(rounds.slice(1));
      const totalGames = games.length;
      const picked = compact(games).length;
      unpicked = ` (${picked}/${totalGames})`;
    }

    return (
      <section className={regionClasses}>
        <h2 className='region-name'>{name + unpicked}</h2>
        <Rounds {...{rounds, onUpdate, id}} />
      </section>
    );
  }
}

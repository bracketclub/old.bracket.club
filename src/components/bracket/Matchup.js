import React, {PropTypes, Component} from 'react';
import {has} from 'lodash';

import Team from './Team';
import WinsIn from './WinsIn';

export default class Matchup extends Component {
  static propTypes = {
    matchup: PropTypes.array,
    fromRegion: PropTypes.string,
    finalId: PropTypes.string,
    onUpdate: PropTypes.func,
    winner: PropTypes.object
  };

  render() {
    let {fromRegion} = this.props;
    const {matchup, onUpdate, finalId, winner} = this.props;
    const hasMatchup = has(matchup, '1');

    // The last team in each region is actually the final region
    if (!hasMatchup) {
      fromRegion = finalId;
    }

    return (
      <ul className='matchup'>
        <Team
          {...matchup[0]}
          fromRegion={fromRegion}
          onUpdate={onUpdate}
        />
        {hasMatchup &&
          <Team
            {...matchup[1]}
            fromRegion={fromRegion}
            onUpdate={onUpdate}
          />
        }
        {winner && <WinsIn {...winner} />}
      </ul>
    );
  }
}

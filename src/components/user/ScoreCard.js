import React, {PropTypes, Component} from 'react';
import charCodes from 'lib/charCodes';

export default class ScoreCard extends Component {
  static propTypes = {
    score: PropTypes.object
  };

  render() {
    const {
      score
    } = this.props;

    if (!score) {
      return null;
    }

    return (
      <div className='score-card'>
        <p>
          <strong>Rank: </strong>{score.index} / {score.total}
          <br />
          <strong>Total: </strong>{score.standard} {charCodes.dot} <strong>PPR: </strong>{score.standardPPR}
          <br />
          <strong>Gooley: </strong>{score.gooley} {charCodes.dot} <strong>PPR: </strong>{score.gooleyPPR}
        </p>
      </div>
    );
  }
}

import React, {PropTypes, Component} from 'react';

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
          <strong>Total: </strong>{score.standard} {String.fromCharCode(183)} <strong>PPR: </strong>{score.standardPPR}
          <br />
          <strong>Gooley: </strong>{score.gooley} {String.fromCharCode(183)} <strong>PPR: </strong>{score.gooleyPPR}
        </p>
      </div>
    );
  }
}

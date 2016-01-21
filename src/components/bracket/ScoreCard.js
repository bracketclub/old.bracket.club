import React, {PropTypes, Component} from 'react';

const scoreTypes = ['standard', 'gooley', 'standardPPR', 'gooleyPPR'];

export default class ScoreCard extends Component {
  static propTypes = {
    entry: PropTypes.string,
    master: PropTypes.string,
    score: PropTypes.func
  };

  render() {
    const {
      entry,
      master,
      score
    } = this.props;

    const scores = score(scoreTypes, {master, entry});

    return (
      <div className='score-card'>
        <p>
          <strong>Total: </strong>{scores.standard} – <strong>PPR: </strong>{scores.standardPPR}<br/>
          <strong>Gooley: </strong>{scores.gooley} – <strong>PPR: </strong>{scores.gooleyPPR}
        </p>
      </div>
    );
  }
}

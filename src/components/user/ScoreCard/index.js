import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import charCodes from 'lib/charCodes';
import styles from './index.less';

@CSSModules(styles)
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

    let gooley = null;
    if (typeof score.gooley === 'number' && typeof score.gooleyPPR === 'number') {
      gooley = (
        <span>
          <br />
          <span>
            <strong>Gooley:</strong>
            {' '}
            {score.gooley}
            {' '}
            {charCodes.dot}
            {' '}
            <strong>PPR:</strong>
            {' '}
            {score.gooleyPPR}
          </span>
        </span>
      );
    }

    return (
      <div styleName='score-card'>
        <p>
          <strong>Rank: </strong>{score.index} / {score.total}
          <br />
          <strong>Total: </strong>{score.standard} {charCodes.dot} <strong>PPR: </strong>{score.standardPPR}
          {gooley}
        </p>
      </div>
    );
  }
}

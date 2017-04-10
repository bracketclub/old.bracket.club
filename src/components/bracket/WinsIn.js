import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class WinsIn extends Component {
  static propTypes = {
    winsIn: PropTypes.number,
    winsInCorrect: PropTypes.bool,
    shouldBe: PropTypes.object
  };

  static defaultProps = {
    shouldBe: {}
  };

  render() {
    const {winsIn, winsInCorrect, shouldBe} = this.props;

    if (!winsIn) {
      return null;
    }

    const shouldBeWins = shouldBe.winsIn;

    const classes = classNames('wins-in', {
      correct: winsInCorrect === true,
      unused: winsIn === shouldBeWins && winsInCorrect === false,
      incorrect: winsIn !== shouldBeWins && winsInCorrect === false
    });

    return (
      <span className={classes}>
        <span className='wins-in-games'>{winsIn}</span>
        {' '}
        {winsIn !== shouldBeWins && winsInCorrect === false &&
          <span className='wins-in-should-be'>({shouldBeWins})</span>
        }
      </span>
    );
  }
}

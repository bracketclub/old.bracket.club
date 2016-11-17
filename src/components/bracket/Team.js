import React, {PropTypes, Component} from 'react';
import classNames from 'classnames';

export default class Team extends Component {
  static propTypes = {
    onUpdate: PropTypes.func,
    eliminated: PropTypes.bool,
    correct: PropTypes.bool,
    shouldBe: PropTypes.object,
    fromRegion: PropTypes.string,
    seed: PropTypes.number,
    name: PropTypes.string
  };

  handleClick = () => {
    const {onUpdate, fromRegion, seed, name} = this.props;

    if (!onUpdate) return;

    if (fromRegion && seed && name) {
      onUpdate({
        fromRegion,
        winner: {seed, name}
      });
    }
  };

  render() {
    const {seed, name, onUpdate, eliminated, correct, shouldBe} = this.props;

    const teamClasses = classNames('team', {
      pickable: onUpdate && name,
      eliminated,
      correct: correct === true,
      incorrect: correct === false
    });

    return (
      <li>
        <a onClick={this.handleClick} className={teamClasses} title={`(${seed}) ${name}`}>
          <span className='seed'>{seed}</span>
          <span className='team-name'>{name}</span>
          {correct === false && shouldBe &&
            <span className='should-be'>
              <span className='seed'>{shouldBe.seed}</span>
              <span className='team-name'>{shouldBe.name}</span>
            </span>
          }
        </a>
      </li>
    );
  }
}

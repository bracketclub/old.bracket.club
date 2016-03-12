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
    const teamClasses = classNames('team', {
      pickable: this.props.onUpdate && this.props.name,
      eliminated: this.props.eliminated,
      correct: this.props.correct === true,
      incorrect: this.props.correct === false
    });
    const shouldBe = this.props.shouldBe;
    const shouldBeClasses = classNames('should-be', {hide: !shouldBe});
    const {seed, name} = this.props;
    return (
      <li>
        <a onClick={this.handleClick} className={teamClasses} title={`(${seed}) ${name}`}>
          <span className='seed'>{seed}</span>
          <span className='team-name'>{name}</span>
          <span className={shouldBeClasses}>
            <span className='seed'>{shouldBe ? shouldBe.seed : ''}</span>
            <span className='team-name'>{shouldBe ? shouldBe.name : ''}</span>
          </span>
        </a>
      </li>
    );
  }
}

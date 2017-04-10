import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import BodyClass from 'react-body-classname';
import tweetHref from 'lib/tweetHref';
import styles from './index.less';

@CSSModules(styles)
export default class ZenBracket extends Component {
  static propTypes = {
    onUpdate: PropTypes.func,
    bracket: PropTypes.string,
    next: PropTypes.func
  };

  state = {
    disabled: false
  }

  handleUpdate(e, team) {
    this.setState({disabled: true});
    this.props.onUpdate({
      fromRegion: team.fromRegion,
      winner: {
        seed: team.seed,
        name: team.name
      }
    });
    const WAIT = 100;
    setTimeout(() => this.setState({disabled: false}), WAIT);
  }

  renderButton(team, style) {
    const {disabled} = this.state;

    return (
      <Button
        block
        disabled={disabled}
        bsStyle='primary'
        styleName={style}
        onClick={(e) => this.handleUpdate(e, team)}
        onTouchStart={(e) => this.handleUpdate(e, team)}
      >
        <span styleName={disabled ? 'text-disabled' : 'text'}>
          {disabled && ''}
          {!disabled &&
            <span>
              ({team.seed})
              <br />
              {team.name}
            </span>
          }
        </span>
      </Button>
    );
  }

  renderButtons() {
    const {event, bracket, next: getNext} = this.props;
    const {disabled} = this.state;
    const nextGame = getNext({currentMaster: bracket});

    if (!nextGame) {
      return (
        <span>
          <Button
            block
            disabled={disabled}
            bsStyle='success'
            styleName='full'
            href={disabled ? null : tweetHref({event, bracket})}
          >
            <span styleName={disabled ? 'text-disabled' : 'text'}>
              {disabled ? '' : 'Enter my Bracket!'}
            </span>
          </Button>
        </span>
      );
    }

    const [team1, team2] = nextGame;
    return (
      <span>
        {this.renderButton(team1, 'left')}
        {this.renderButton(team2, 'right')}
      </span>
    );
  }

  renderLocked() {
    return (
      <Button
        block
        bsStyle='default'
        disabled
        styleName='full'
      >
        This event is locked!
      </Button>
    );
  }

  render() {
    const {
      bracket,
      next,
      onUpdate,
      locked
    } = this.props;

    if (!bracket || !next || !onUpdate) return null;

    return (
      <BodyClass className='hide-all'>
        <div styleName='root'>
          {locked ? this.renderLocked() : this.renderButtons()}
        </div>
      </BodyClass>
    );
  }
}

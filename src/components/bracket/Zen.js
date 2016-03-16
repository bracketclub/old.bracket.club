import React, {Component, PropTypes} from 'react';
import {each, shuffle, omit, sample} from 'lodash';
import {Button} from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import BodyClass from 'react-body-classname';

import styles from './styles/Zen.less';
import tweetHref from 'lib/tweetHref';

const allIndices = (arr, val) => {
  const indices = [];
  let i = -1;
  while ((i = arr.indexOf(val, i + 1)) !== -1) {
    indices.push(i);
  }
  return indices;
};

@CSSModules(styles)
export default class ZenBracket extends Component {
  static propTypes = {
    onUpdate: PropTypes.func,
    bracket: PropTypes.string,
    validate: PropTypes.func
  };

  state = {
    disabled: false
  }

  getNextGame() {
    const {bracket, validate} = this.props;
    const bracketObj = validate(bracket);
    let nextGame;

    const regionKeys = shuffle(Object.keys(omit(bracketObj, 'regionFinal'))).concat('regionFinal');

    each(regionKeys, (regionKey) => {
      const region = bracketObj[regionKey];
      const {rounds} = region;

      each(rounds, (round, roundIndex) => {
        const indices = allIndices(round, null);
        const game = indices.length ? sample(indices) : null;
        if (game !== null) {
          nextGame = {
            region: regionKey,
            regionId: region.id,
            round: roundIndex,
            game
          };
          return false;
        }
        return true;
      });

      return !nextGame;
    });

    if (nextGame) {
      const prevRound = bracketObj[nextGame.region].rounds[nextGame.round - 1];
      return shuffle([
        {...prevRound[nextGame.game * 2], fromRegion: nextGame.regionId},
        {...prevRound[nextGame.game * 2 + 1], fromRegion: nextGame.regionId}
      ]);
    }

    return null;
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

  renderButtons() {
    const {event, bracket} = this.props;
    const {disabled} = this.state;
    const nextGame = this.getNextGame();
    let buttons = null;

    if (!nextGame) {
      buttons = (
        <span>
          <Button
            block
            bsStyle='success'
            styleName='full'
            href={tweetHref({event, bracket})}
          >
            <span>
              Tweet it!
            </span>
          </Button>
        </span>
      );
    }
    else {
      const [team1, team2] = nextGame;
      buttons = (
        <span>
          <Button
            block
            disabled={disabled}
            bsStyle='primary'
            styleName='left'
            onClick={(e) => !disabled && this.handleUpdate(e, team1)}
            onTouchStart={(e) => !disabled && this.handleUpdate(e, team1)}
          >
            <span styleName={disabled ? 'text-disabled' : 'text'}>
              {disabled && ''}
              {!disabled &&
                <span>
                  ({team1.seed})
                  <br />
                  {team1.name}
                </span>
              }
            </span>
          </Button>
          <Button
            block
            disabled={disabled}
            bsStyle='primary'
            styleName='right'
            onClick={(e) => !disabled && this.handleUpdate(e, team2)}
            onTouchStart={(e) => !disabled && this.handleUpdate(e, team2)}
          >
            <span styleName={disabled ? 'text-disabled' : 'text'}>
              {disabled && ''}
              {!disabled &&
                <span>
                  ({team2.seed})
                  <br />
                  {team2.name}
                </span>
              }
            </span>
          </Button>
        </span>
      );
    }

    return buttons;
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
      validate,
      onUpdate,
      locked
    } = this.props;

    if (!bracket || !validate || !onUpdate) return null;

    return (
      <BodyClass className='hide-all'>
        <div styleName='root'>
          {locked ? this.renderLocked() : this.renderButtons()}
        </div>
      </BodyClass>
    );
  }
}

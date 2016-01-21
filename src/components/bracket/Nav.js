import React, {PropTypes, Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {Glyphicon, Button, ButtonToolbar, ButtonGroup} from 'react-bootstrap';

export default class BracketNav extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    onGenerate: PropTypes.func,
    onReset: PropTypes.func,
    onNavigate: PropTypes.func.isRequired
  };

  render() {
    const {navigation, onGenerate, onNavigate, onReset} = this.props;
    const {canGoBack, canGoForward, canReset} = navigation;

    const items = [
      <ButtonGroup key={0}>
        <Button disabled={!canGoBack} onClick={() => onNavigate('goToFirst')}>
          <Glyphicon glyph='fast-backward' />
        </Button>
        <Button disabled={!canGoBack} onClick={() => onNavigate('goToPrevious')}>
          <Glyphicon glyph='step-backward' />
        </Button>
        <Button disabled={!canGoForward} onClick={() => onNavigate('goToNext')}>
          <Glyphicon glyph='step-forward' />
        </Button>
        <Button disabled={!canGoForward} onClick={() => onNavigate('goToLast')}>
          <Glyphicon glyph='fast-forward' />
        </Button>
      </ButtonGroup>
    ];

    if (onGenerate && onReset) {
      items.push(
        <ButtonGroup key={1}>
          <Button disabled={!canReset} onClick={() => onReset('reset')}>
            <Glyphicon glyph='ban-circle' />
          </Button>
          <Button onClick={() => onGenerate('lower')}>1</Button>
          <Button onClick={() => onGenerate('higher')}>16</Button>
          <Button onClick={() => onGenerate('random')}>
            <Glyphicon glyph='random' />
          </Button>
        </ButtonGroup>
      );
    }

    return <ButtonToolbar className='bracket-nav'>{items}</ButtonToolbar>;
  }
}

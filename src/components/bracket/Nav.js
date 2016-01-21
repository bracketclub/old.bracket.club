import React, {PropTypes, Component} from 'react';
import {Glyphicon, Button, ButtonToolbar, ButtonGroup} from 'react-bootstrap';

export default class BracketNav extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    onGenerate: PropTypes.func,
    onReset: PropTypes.func,
    onNavigate: PropTypes.func.isRequired
  };

  render() {
    const {navigation, onGenerate, onNavigate, onReset} = this.props;
    const {canGoBack, canGoForward, canReset} = navigation;

    return (
      <ButtonToolbar className='bracket-nav'>
        <ButtonGroup>
          <Button disabled={!canGoBack} onClick={() => canGoBack && onNavigate('goToFirst')}>
            <Glyphicon glyph='fast-backward' />
          </Button>
          <Button disabled={!canGoBack} onClick={() => canGoBack && onNavigate('goToPrevious')}>
            <Glyphicon glyph='step-backward' />
          </Button>
          <Button disabled={!canGoForward} onClick={() => canGoForward && onNavigate('goToNext')}>
            <Glyphicon glyph='step-forward' />
          </Button>
          <Button disabled={!canGoForward} onClick={() => canGoForward && onNavigate('goToLast')}>
            <Glyphicon glyph='fast-forward' />
          </Button>
        </ButtonGroup>
        {onGenerate && onReset &&
          <ButtonGroup>
            <Button disabled={!canReset} onClick={() => canReset && onReset('reset')}>
              <Glyphicon glyph='ban-circle' />
            </Button>
            <Button onClick={() => onGenerate('lower')}>1</Button>
            <Button onClick={() => onGenerate('higher')}>16</Button>
            <Button onClick={() => onGenerate('random')}>
              <Glyphicon glyph='random' />
            </Button>
          </ButtonGroup>
        }
      </ButtonToolbar>
    );
  }
}

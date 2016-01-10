'use strict';

const React = require('react');
const {PropTypes} = React;
const {PureRenderMixin} = require('react-pure-render/mixin');

const Glyphicon = require('react-bootstrap/lib/Glyphicon');
const Button = require('react-bootstrap/lib/Button');
const ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
const ButtonGroup = require('react-bootstrap/lib/ButtonGroup');

const bracketEntryActions = require('../../actions/bracketEntryActions');
const masterActions = require('../../actions/masterActions');

const BracketNav = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    history: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    locked: PropTypes.bool.isRequired
  },

  getNavProps() {
    const {history, index} = this.props;
    const hasHistory = history.length > 0;
    return {
      canRewind: hasHistory && index > 0,
      canFastForward: hasHistory && index < history.length - 1,
      canReset: history.length > 1
    };
  },

  getNavActions() {
    return this.props.locked ? masterActions : bracketEntryActions;
  },

  handleGenerateClick(method) {
    this.getNavActions().generate(method);
  },

  handleHistoryClick(method) {
    this.getNavActions()[method]();
  },

  render() {
    const {canRewind, canFastForward, canReset} = this.getNavProps();
    const {locked} = this.props;
    const {handleGenerateClick: generate, handleHistoryClick: history} = this;

    const items = [
      <ButtonGroup key={0}>
        <Button disabled={!canRewind} onClick={history.bind(null, 'getFirst')}>
          <Glyphicon glyph='fast-backward' />
        </Button>
        <Button disabled={!canRewind} onClick={history.bind(null, 'getPrevious')}>
          <Glyphicon glyph='step-backward' />
        </Button>
        <Button disabled={!canFastForward} onClick={history.bind(null, 'getNext')}>
          <Glyphicon glyph='step-forward' />
        </Button>
        <Button disabled={!canFastForward} onClick={history.bind(null, 'getLast')}>
          <Glyphicon glyph='fast-forward' />
        </Button>
      </ButtonGroup>
    ];

    if (!locked) {
      items.push(
        <ButtonGroup key={1}>
          <Button disabled={!canReset} onClick={history.bind(null, 'reset')}>
            <Glyphicon glyph='ban-circle' />
          </Button>
          <Button onClick={generate.bind(null, 'lower')}>1</Button>
          <Button onClick={generate.bind(null, 'higher')}>16</Button>
          <Button onClick={generate.bind(null, 'random')}>
            <Glyphicon glyph='random' />
          </Button>
        </ButtonGroup>
      );
    }

    return <ButtonToolbar className='bracket-nav'>{items}</ButtonToolbar>;
  }
});

module.exports = BracketNav;

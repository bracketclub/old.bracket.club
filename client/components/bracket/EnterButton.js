'use strict';

const qs = require('qs');
const React = require('react');
const {PropTypes} = React;
const {PureRenderMixin} = require('react-pure-render/mixin');

const Button = require('react-bootstrap/lib/Button');
const OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
const Popover = require('react-bootstrap/lib/Popover');
const Alert = require('react-bootstrap/lib/Alert');
const TimeAgo = require('react-timeago');

const bracketHelpers = require('../../helpers/bracket');
const {enterBracket} = require('../../helpers/analytics');

const EnterButton = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    sport: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    history: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired
  },

  handleEnterClick(bracket) {
    enterBracket(bracket);
  },

  render() {
    const {sport, year, history, index} = this.props;

    const bracket = history[index];
    const {locks, unpickedChar} = bracketHelpers({sport, year});

    const complete = (bracket.split(unpickedChar).length - 1) === 0;

    const account = 'tweetthebracket';
    const hashtags = 'tybrkt';
    const tweetBase = 'https://twitter.com/share?';
    const tweetQs = qs.stringify({
      text: 'Check out my #bracket!',
      url: `http://tweetyourbracket.com/${year}/${bracket}`,
      hashtags,
      lang: 'en',
      related: account,
      via: account,
      count: 'none'
    });

    const popover = (
      <Popover>
        <p>You'll be taken to <strong>twitter.com</strong> to tweet your bracket!</p>
        <Alert bsStyle='info'>
          <strong>Important!</strong> Don't alter the <strong>url</strong> or <strong>#tybrkt hashtag</strong> of the tweet. We use those to verify your entry.
        </Alert>
      </Popover>
    );

    return (
      <div className='bracket-enter' title={!complete ? locks : ''}>
        {complete
          ? <OverlayTrigger trigger='hover' placement='bottom' overlay={popover}>
            <Button
              bsStyle='primary'
              block
              href={`${tweetBase}${tweetQs}`}
              onClick={this.handleEnterClick.bind(null, bracket)}
              target='_blank'
            >
              Tweet My Bracket!
            </Button>
          </OverlayTrigger>
          : <Button disabled block bsStyle='primary' componentClass='button'>
            Brackets lock <TimeAgo date={locks} />
          </Button>
        }
      </div>
    );
  }
});

module.exports = EnterButton;

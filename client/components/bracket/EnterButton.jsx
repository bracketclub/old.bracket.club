'use strict';

let qs = require('qs');
let React = require('react');
let {PropTypes} = React;
let {PureRenderMixin} = require('react/addons').addons;

let Button = require('react-bootstrap/lib/Button');
let OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
let Popover = require('react-bootstrap/lib/Popover');
let Alert = require('react-bootstrap/lib/Alert');
let TimeAgo = require('react-timeago');

let bracketHelpers = require('../../helpers/bracket');
let {enterBracket} = require('../../helpers/analytics');


let EnterButton = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
        sport: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired,
        history: PropTypes.array.isRequired,
        index: PropTypes.number.isRequired
    },

    handleEnterClick (bracket) {
        enterBracket(bracket);
    },

    render () {
        let {sport, year, history, index} = this.props;

        let bracket = history[index];
        let {locks, unpickedChar} = bracketHelpers({sport, year});

        let complete = (bracket.split(unpickedChar).length - 1) === 0;

        let account = 'tweetthebracket';
        let hashtags = 'tybrkt';
        let tweet = 'https://twitter.com/share?' + qs.stringify({
            text: 'Check out my #bracket!',
            url: 'http://tweetyourbracket.com/' + year + '/' + bracket,
            hashtags,
            lang: 'en',
            related: account,
            via: account,
            count: 'none'
        });

        let popover = (
            <Popover>
                <p>You'll be taken to <strong>twitter.com</strong> to tweet your bracket!</p>
                <Alert bsStyle='info'>
                      <strong>Important!</strong> Don't alter the <strong>url</strong> or <strong>#tybrkt hashtag</strong> of the tweet. We use those to verify your entry.
                </Alert>
            </Popover>
        );

        return (
            <div className='bracket-enter' title={!complete ? locks : ''}>
                {complete ?
                    <OverlayTrigger trigger='hover' placement='bottom' overlay={popover}>
                        <Button bsStyle='primary' block href={tweet} onClick={this.handleEnterClick.bind(null, bracket)} target='_blank'>Tweet My Bracket!</Button>
                    </OverlayTrigger>
                    :
                    <Button disabled block bsStyle='primary' componentClass='button'>
                        Brackets lock <TimeAgo date={locks} />
                    </Button>
                }
            </div>
        );
    }
});

module.exports = EnterButton;

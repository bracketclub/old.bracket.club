let React = require('react');


let Footer = React.createClass({
    render () {
        return (
            <footer>
                <ul className='footer-links'>
                    <li><a href='https://twitter.com/tweetthebracket'>Twitter</a></li>
                    <li className='muted'>&middot;</li>
                    <li><a href='https://github.com/tweetyourbracket'>GitHub</a></li>
                    <li className='muted'>&middot;</li>
                    <li><a href='http://lukecod.es/2014/01/25/tweet-your-bracket/'>What Is This?</a></li>
                    <li className='follow-button'>
                        <a className='twitter-follow-button' href='https://twitter.com/TweetTheBracket' data-show-count="false">
                            Follow @TweetTheBracket
                        </a>
                    </li>
                </ul>
                <p>
                    Made with love by <a href='https://twitter.com/lukekarrys'>Luke</a> in Arizona.
                </p>
            </footer>
        );
    }
});

module.exports = Footer;

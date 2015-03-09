let React = require('react');
let flatten = require('lodash/array/flatten');
let TimeAgo = require('react-timeago');

let infoLinks = [{
    text: 'Twitter',
    href: 'https://twitter.com/tweetthebracket'
}, {
    text: 'GitHub',
    href: 'https://github.com/tweetyourbracket'
}, {
    text: 'What Is This?',
    href: 'http://lukecod.es/2014/01/25/tweet-your-bracket/'
}];

let researchLinks = [{
    text: 'FiveThirtyEight',
    href: 'http://fivethirtyeight.com/?s=march+madness'
}];

let FooterLinks = React.createClass({
    render () {
        let links = [];

        if (this.props.title) {
            links.push(<li key='title'>{this.props.title}</li>);
        }

        links.push(flatten(this.props.links.map((link, index) =>
            [<li key={index}><a href={link.href}>{link.text}</a></li>,
            index < this.props.links.length - 1 ? <li key={index + 'sep'} className='muted'>&middot;</li> : null]
        )));

        return <ul className='footer-links'>{links}</ul>;
    }
});


let Footer = React.createClass({
    render () {
        return (
            <footer>
                <FooterLinks links={infoLinks} />
                <FooterLinks links={researchLinks} title='Bracket Research:' />
                <p className='follow-button'>
                    <a className='twitter-follow-button' href='https://twitter.com/TweetTheBracket' data-show-count="false">
                        Follow @TweetTheBracket
                    </a>
                </p>
                <p>Made with love by <a href='https://twitter.com/lukekarrys'>Luke</a> in Arizona.</p>
                <p>Last updated: <TimeAgo date={this.props.lastUpdated} title={this.props.lastUpdated} /></p>
            </footer>
        );
    }
});

module.exports = Footer;

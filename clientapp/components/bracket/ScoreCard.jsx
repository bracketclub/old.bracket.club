let React = require('react');


let ScoreCard = React.createClass({
    render () {
        return (<div className='score-card'>
            <h2>
                {this.props.username} 
                <a className='twitter' href={'https://twitter.com/' + this.props.username}>
                    <img src='https://g.twimg.com/Twitter_logo_blue.png' />
                </a>
            </h2>
            <p>
                <strong>Total: </strong> - {this.props.standard} - <strong>PPR: </strong> - {this.props.standardPPR}<br/>
                <strong>Gooley: </strong>{this.props.gooley} - <strong>PPR: </strong> - {this.props.gooleyPPR}
            </p>
        </div>);
    }
});

module.exports = ScoreCard;

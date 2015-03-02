let React = require('react');

let globalDataStore = require('../../stores/globalDataStore');
let masterStore = require('../../stores/masterStore');


let ScoreCard = React.createClass({
    componentWillMount () {
        globalDataStore.listen(this.onChange);
        masterStore.listen(this.onChange);
    },

    componentWillUnmount () {
        globalDataStore.unlisten(this.onChange);
        masterStore.unlisten(this.onChange);
    },

    componentWillReceiveProps (props) {
        this.setState(this.getStateFromBracket(props));
    },

    getStateFromBracket (props) {
        let {scorer} = globalDataStore.getState();
        let {master, bracket: entry} = props;

        return scorer.score(['standard', 'gooley', 'standardPPR', 'gooleyPPR'], {
            master,
            entry
        });
    },

    getInitialState () {
        return this.getStateFromBracket(this.props);
    },

    onChange () {
        this.setState(this.getStateFromBracket(this.props));
    },

    render () {
        return (
            <div className='score-card'>
                <h2>
                    {this.props.username} 
                    <a className='twitter' href={'https://twitter.com/' + this.props.username}>
                        <img src='https://g.twimg.com/Twitter_logo_blue.png' />
                    </a>
                </h2>
                <p>
                    <strong>Total: </strong> - {this.state.standard} - <strong>PPR: </strong> - {this.state.standardPPR}<br/>
                    <strong>Gooley: </strong>{this.state.gooley} - <strong>PPR: </strong> - {this.state.gooleyPPR}
                </p>
            </div>
        );
    }
});

module.exports = ScoreCard;

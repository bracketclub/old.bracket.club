let React = require('react');
let getBracketObject = require('../../helpers/getBracketObject');

let Bracket = require('./Bracket');
let BracketNav = require('./Nav');
let BracketProgress = require('./Progress');
let ScoreCard = require('./ScoreCard');


module.exports = React.createClass({
    mixins: [getBracketObject],

    isEntry () {
        return !this.props.user;
    },

    render () {
        let props = this.props;
        return (<div>
            <BracketNav locked={props.locked} history={props.history} index={props.index} />
            <BracketProgress bracket={props.bracket} progressText='picks made' />
            {this.isEntry() ? null : <ScoreCard {...props.user} />}
            <Bracket locked={props.locked} bracket={this.isEntry() ? this.getEntry() : this.getUser()} />
        </div>);
    }
});

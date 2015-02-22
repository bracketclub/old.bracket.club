let React = require('react');
let ProgressBar = require('react-bootstrap/lib/ProgressBar');


let BracketProgress = React.createClass({
    render () {
        return (
            <ProgressBar
            striped
            now={this.props.progress}
            min={0}
            max={this.props.progressTotal}
            label={"%(now)s of %(max)s " + this.props.progressText} />
        );
    }
});

module.exports = BracketProgress;

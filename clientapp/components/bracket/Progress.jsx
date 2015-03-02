let React = require('react');
let ProgressBar = require('react-bootstrap/lib/ProgressBar');
let globalDataStore = require('../../stores/globalDataStore');


let BracketProgress = React.createClass({
    componentWillMount () {
        globalDataStore.listen(this.onChange);
    },

    componentWillUnmount () {
        globalDataStore.unlisten(this.onChange);
    },

    componentWillReceiveProps (props) {
        this.setState(this.getStateFromBracket(props));
    },

    getStateFromBracket (props) {
        let {constants} = globalDataStore.getState().bracketData;
        let {bracket} = props;
        let total = (constants.TEAMS_PER_REGION * constants.REGION_COUNT) - 1;
        let unpicked = constants.UNPICKED_MATCH;

        return {total, progress: total - (bracket.split(unpicked).length - 1)};
    },

    getInitialState () {
        return this.getStateFromBracket(this.props);
    },

    onChange () {
        this.setState(this.getStateFromBracket(this.props));
    },

    render () {
        return (<ProgressBar
            striped
            now={this.state.progress}
            min={0}
            max={this.state.total}
            label={"%(now)s of %(max)s " + this.props.progressText}
        />);
    }
});

module.exports = BracketProgress;

var React = require('react');
var matchupsByRound = function (round) {
    var matchups = [];
    // [teamA, teamB, teamC, teamD] -->
    // [{team1: teamA, team2: teamB}, {team1: teamC, team2: teamD}]
    for (var i = 0, m = round.length; i < m; i +=2 ) {
        matchups.push({team1: round[i], team2: round[i + 1]});
    }
    return matchups;
};

var Team = React.createClass({
    render () {
        var eliminated = this.props.eliminated ? 'eliminated' : '';
        var correct = this.props.correct === true ? 'correct' : '';
        var incorrect = this.props.correct === false ? 'incorrect' : '';
        var hideShouldBe = !this.props.shouldBe ? 'hide' : '';
        return (
            <li>
                <a
                className="team {eliminated} {correct} {incorrect}"
                data-region={this.props.fromRegion}
                data-seed={this.props.seed}
                data-name={this.props.name}
                data-id={this.props.fromRegion + this.props.seed}
                >
                    <span className="seed">{this.props.seed}</span>
                    <span className="team-name">{this.props.name}</span>
                    <span className="should-be {hideShouldBe}">
                        <span className="seed">{!hideShouldBe ? this.props.shouldBe.seed : ''}</span>
                        <span className="team-name">{!hideShouldBe ? this.props.shouldBe.name : ''}</span>
                    </span>
                </a>
            </li>
        );
    }
});

var Matchup = React.createClass({
    render () {
        return (
            <ul className='matchup'>
              <Team {...this.props.team1} />
              <Team {...this.props.team2} />
            </ul>
        );
    }
});

var Round = React.createClass({
    render () {
        return (
            <div className="round">
                {matchupsByRound(this.props.round).map((matchup, index) => <Matchup key={index} {...matchup} />)}
            </div>
        );
    }
});

var Region = React.createClass({
    render () {
        return (
            <section className="region clearfix" data-id={this.props.data.id}>
                <h2>{this.props.data.name}</h2>
                <div className="rounds clearfix">
                    {this.props.data.rounds.map((round, index) => <Round key={index} round={round} />)}
                </div>
            </section>
        );
    }
});

module.exports = React.createClass({
    render () {
        return (
            <div className="bracket clearfix row" data-bracket={this.props.data.current}>
                <div className="col-md-6 region-side clearfix left-side">
                    <Region data={this.props.data._region1} />
                    <Region data={this.props.data._region2} />
                </div>
                <div className="col-md-6 region-side clearfix right-side">
                    <Region data={this.props.data._region3} />
                    <Region data={this.props.data._region4} />
                </div>
                <div className="col-md-12 clearfix">
                    <Region data={this.props.data._regionFinal} />
                </div>
            </div>
        );
    }
});

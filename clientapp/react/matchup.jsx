var React = require('react');

var Team = React.createClass({
    render () {
        return (
            <li>
                <a>
                    <span>{this.props.seed}</span>
                    <span>{this.props.name}</span>
                </a>
            </li>
        );
    }
});

var Matchup = React.createClass({
    render () {
        return (
            <ul className='matchup'>
              <Team data={this.props.team1}/>
              <Team data={this.props.team2}/>
            </ul>
        );
    }
});

var Region = React.createClass({
    render () {
        return (
            <section className="region clearfix" data-id={this.props.id}>
                <h2>{this.props.name}</h2>
                <div className="rounds clearfix">
                    {this.props.rounds.map((round) => 
                        return <div className="round"><Matchup data={team1: round[0], team2: round[1]}/></div>
                    )}
                </div>
            </section>
        );
    }
});

var LargeFinal = React.createClass({
    render () {
        return (
            <section className="region clearfix" data-id={this.props.id}>
                <div className="rounds clearfix">
                    {this.props.rounds.map((round) => 
                        return <div className="round"><Matchup data={team1: round[0], team2: round[1]}/></div>
                    )}
                </div>
            </section>
        );
    }
});

// mixin largeScreenFinal(region, pickable)
//   section.clearfix.region(role='region', data-id=region.id)
//     .matchups.clearfix
//       - for (var i = 1, m = region.rounds.length; i < m; i++)
//         - var round = region.rounds[i]
//         .round
//           - for (var ii = 0, mm = round.length; ii < mm; ii += 2)
//             mixin matchups(round[ii], round[ii + 1], pickable)

var Bracket = React.createClass({
    render () {
        return (
            <div className="bracket clearfix row" data-bracket={this.props.flat}>
                <div className="col-md-6 region-side clearfix left-side">
                    <Region data={this.props.ordered[0]} />
                    <Region data={this.props.ordered[1]} />
                <div>
                <div className="col-md-6 region-side clearfix right-side">
                    <Region data={this.props.ordered[2]} />
                    <Region data={this.props.ordered[3]} />
                <div>
                <div className="col-md-12 hidden-md hidden-lg clearfix">
                    <Region data={this.props.ordered[4]} />
                </div>
                <div className="large-screen-final hidden-sm hidden-xs clearfix">
                    <LargeFinal data={this.props.ordered[4]} />
                </div>
            </div>
        );
    }
});


// mixin team(team, pickable)
//   - if (typeof team !== 'undefined')
//     li
//       - if (team)
//         - var classes = ['']
//         - team.eliminated && classes.push('eliminated')
//         - team.correct === true && classes.push('correct')
//         - team.correct === false && classes.push('incorrect')
//         - pickable && classes.push('pickable')
//         a.team(class=classes.join(' '), role='team', data-region=team.fromRegion, data-seed=team.seed, data-name=team.name, data-id=team.fromRegion + team.seed)
//           span.seed #{team.seed}
//           span.team-name #{team.name}
//           - if (team.shouldBe)
//             span.should-be
//               span.seed #{team.shouldBe.seed}
//               span.team-name #{team.shouldBe.name}
//       - else
//         a.empty &nbsp;





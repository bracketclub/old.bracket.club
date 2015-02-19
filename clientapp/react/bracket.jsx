var React = require('react');
var cx = require('react/lib/cx');
var chunk = require('lodash/array/chunk');
var has = require('lodash/object/has');

var Team = React.createClass({
    render () {
        var aClasses = cx({
            team: true,
            eliminated: this.props.eliminated,
            correct: this.props.correct === true,
            incorrect: this.props.correct === false
        });
        var shouldBe = this.props.shouldBe;
        var shouldBeClasses = cx({
            'should-be': true,
            hide: !shouldBe
        });
        var region = this.props.fromRegion || '';
        var seed = this.props.seed || '';
        var name = this.props.name || '';
        return (
            <li>
                <a className={aClasses} data-region={region} data-seed={seed} data-name={name} data-id={region + seed}>
                    <span className="seed">{seed}</span>
                    <span className="team-name">{name}</span>
                    <span className={shouldBeClasses}>
                        <span className="seed">{shouldBe ? shouldBe.seed : ''}</span>
                        <span className="team-name">{shouldBe ? shouldBe.name : ''}</span>
                    </span>
                </a>
            </li>
        );
    }
});

var Matchup = React.createClass({
    render () {
        return (
            <ul className='matchup'>{[
                <Team key='0' {...this.props[0]} />,
                has(this.props, '1') ? <Team key='1' {...this.props[1]} /> : null
            ]}</ul>
        );
    }
});

var Round = React.createClass({
    render () {
        return (
            <div className="round">
                {chunk(this.props.round, 2).map((matchup, index) =>
                    <Matchup key={index} {...matchup} />
                )}
            </div>
        );
    }
});

var Region = React.createClass({
    render () {
        var classes = cx({
            region: true,
            clearfix: true,
            'final-region': this.props.final,
            'initial-region': !this.props.final
        });
        return (
            <section className={classes} data-id={this.props.id}>
                <h2>{this.props.name}</h2>
                <div className="rounds clearfix">
                    {this.props.rounds.map((round, index) =>
                        <Round key={index} round={round} />
                    )}
                </div>
            </section>
        );
    }
});

module.exports = React.createClass({
    render () {
        var data = this.props;
        return (
            <div className="bracket clearfix row" data-bracket={data.current}>
                <div className="col-md-6 region-side clearfix left-side">
                    <Region {...data._region1} final={false} />
                    <Region {...data._region2} final={false} />
                </div>
                <div className="col-md-6 region-side clearfix right-side">
                    <Region {...data._region3} final={false} />
                    <Region {...data._region4} final={false} />
                </div>
                <div className="col-md-12 clearfix">
                    <Region {...data._regionFinal} final={true} />
                </div>
            </div>
        );
    }
});

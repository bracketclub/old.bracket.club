let React = require('react');
let cx = require('react/lib/cx');
let chunk = require('lodash/array/chunk');
let has = require('lodash/object/has');

let Team = React.createClass({
    render () {
        let aClasses = cx({
            team: true,
            eliminated: this.props.eliminated,
            correct: this.props.correct === true,
            incorrect: this.props.correct === false
        });
        let shouldBe = this.props.shouldBe;
        let shouldBeClasses = cx({
            'should-be': true,
            hide: !shouldBe
        });
        let {fromRegion, seed, name} = this.props;
        return (
            <li>
                <a className={aClasses} data-region={fromRegion} data-seed={seed} data-name={name} data-id={fromRegion + seed}>
                    <span className='seed'>{seed}</span>
                    <span className='team-name'>{name}</span>
                    <span className={shouldBeClasses}>
                        <span className='seed'>{shouldBe ? shouldBe.seed : ''}</span>
                        <span className='team-name'>{shouldBe ? shouldBe.name : ''}</span>
                    </span>
                </a>
            </li>
        );
    }
});

let Matchup = React.createClass({
    render () {
        return (
            <ul className='matchup'>{[
                <Team key='0' {...this.props[0]} />,
                has(this.props, '1') ? <Team key='1' {...this.props[1]} /> : null
            ]}</ul>
        );
    }
});

let Round = React.createClass({
    render () {
        return (
            <div className='round'>
                {chunk(this.props.round, 2).map((matchup, index) =>
                    <Matchup key={index} {...matchup} />
                )}
            </div>
        );
    }
});

let Region = React.createClass({
    render () {
        let classes = cx({
            region: true,
            clearfix: true,
            'final-region': this.props.final,
            'initial-region': !this.props.final
        });
        return (
            <section className={classes} data-id={this.props.id}>
                <h2>{this.props.name}</h2>
                <div className='rounds clearfix'>
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
        let {region1, region2, region3, region4, regionFinal, current} = this.props;
        return (
            <div className='bracket clearfix row' data-bracket={current}>
                <div className='col-md-6 region-side clearfix left-side'>
                    <Region {...region1} final={false} />
                    <Region {...region2} final={false} />
                </div>
                <div className='col-md-6 region-side clearfix right-side'>
                    <Region {...region3} final={false} />
                    <Region {...region4} final={false} />
                </div>
                <div className='col-md-12 clearfix'>
                    <Region {...regionFinal} final={true} />
                </div>
            </div>
        );
    }
});

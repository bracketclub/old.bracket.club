let React = require('react');
let cx = require('react/lib/cx');
let chunk = require('lodash/array/chunk');
let has = require('lodash/object/has');
let bracketActions = require('../../actions/bracketActions');


let Team = React.createClass({
    handleClick (data) {
        bracketActions.updateGame({
            fromRegion: data.fromRegion,
            winner: data.seed
        });
    },
    render () {
        let aClasses = cx({
            pickable: this.props.canEdit,
            eliminated: this.props.eliminated,
            correct: this.props.correct === true,
            incorrect: this.props.correct === false
        });
        let shouldBe = this.props.shouldBe;
        let shouldBeClasses = cx({hide: !shouldBe});
        let {fromRegion, seed, name} = this.props;
        return (
            <li>
                <a
                    onClick={this.handleClick.bind(null, this.props)}
                    className={'team ' + aClasses}
                    data-region={fromRegion}
                    data-seed={seed}
                    data-name={name} 
                    data-id={fromRegion + seed}
                >
                    <span className='seed'>{seed}</span>
                    <span className='team-name'>{name}</span>
                    <span className={'should-be ' + shouldBeClasses}>
                        <span className='seed'>{shouldBe ? shouldBe.seed : ''}</span>
                        <span className='team-name'>{shouldBe ? shouldBe.name : ''}</span>
                    </span>
                </a>
            </li>
        );
    }
});


let Region = React.createClass({
    render () {
        let classes = cx({
            'final-region': this.props.final,
            'initial-region': !this.props.final
        });
        return (
            <section className={'region ' + classes} data-id={this.props.id}>
                <h2 className='region-name'>{this.props.name}</h2>
                <div className='rounds'>
                    <div className='rounds-scroll'>
                        {this.props.rounds.map((round, index) =>
                            <div key={index} className='round'>
                                {chunk(round, 2).map((matchup, index) =>
                                    <ul key={index} className='matchup'>{[
                                        <Team key='0' {...matchup[0]}
                                            canEdit={this.props.canEdit}
                                        />,
                                        has(matchup, '1') ? <Team key='1' {...matchup[1]}
                                            canEdit={this.props.canEdit}
                                        /> : null
                                    ]}</ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    }
});

let Bracket = React.createClass({
    render () {
        let {locked, bracket} = this.props;
        return (
            <div className='bracket row'>
                <div className='col-md-6 region-side left-side'>
                    <Region {...bracket.region1} final={false} canEdit={!locked} />
                    <div className='final-round-borders' />
                    <Region {...bracket.region2} final={false} canEdit={!locked} />
                    <div className='final-round-borders' />
                </div>
                <div className='col-md-6 region-side right-side'>
                    <Region {...bracket.region3} final={false} canEdit={!locked} />
                    <div className='final-round-borders' />
                    <Region {...bracket.region4} final={false} canEdit={!locked} />
                    <div className='final-round-borders' />
                </div>
                <div className='col-md-12 final-region-container'>
                    <Region {...bracket.regionFinal} final={true} canEdit={!locked} />
                </div>
            </div>
        );
    }
});

module.exports = Bracket;

'use strict';

let React = require('react');
let {PropTypes} = React;
let classNames = require('classnames');

let chunk = require('lodash/array/chunk');
let has = require('lodash/object/has');
let flatten = require('lodash/array/flatten');
let compact = require('lodash/array/compact');

let bracketEntryActions = require('../../actions/bracketEntryActions');


let Team = React.createClass({
    propTypes: {
        canEdit: PropTypes.bool.isRequired,
        eliminated: PropTypes.bool,
        correct: PropTypes.bool,
        shouldBe: PropTypes.object,
        fromRegion: PropTypes.string,
        seed: PropTypes.number,
        name: PropTypes.string
    },

    handleClick (data) {
        let {fromRegion, seed, name} = data;
        if (fromRegion && seed && name) {
            bracketEntryActions.updateGame({
                fromRegion,
                winner: {seed, name}
            });
        }
    },
    render () {
        let aClasses = classNames({
            pickable: this.props.canEdit,
            eliminated: this.props.eliminated,
            correct: this.props.correct === true,
            incorrect: this.props.correct === false
        });
        let shouldBe = this.props.shouldBe;
        let shouldBeClasses = classNames({hide: !shouldBe});
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

let Matchup = React.createClass({
    propTypes: {
        matchup: PropTypes.array,
        key: PropTypes.number,
        canEdit: PropTypes.bool,
        fromRegion: PropTypes.string
    },

    render () {
        let {matchup, key, canEdit, fromRegion} = this.props;
        let hasMatchup = has(matchup, '1');

        // The last team in each region is actually the final
        // so we update the fromRegion so it works with the updateGame action
        if (!hasMatchup) {
            fromRegion = 'FF';
        }

        let teams = [
            <Team key='0' {...matchup[0]} fromRegion={fromRegion} canEdit={canEdit} />
        ];

        if (hasMatchup) {
            teams.push(
                <Team key='1' {...matchup[1]} fromRegion={fromRegion} canEdit={canEdit} />
            );
        }

        return <ul key={key} className='matchup'>{teams}</ul>;
    }
});

let Region = React.createClass({
    propTypes: {
        final: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        rounds: PropTypes.array.isRequired,
        id: PropTypes.string.isRequired,
        canEdit: PropTypes.bool.isRequired
    },

    render () {
        let classes = classNames({
            'final-region': this.props.final,
            'initial-region': !this.props.final
        });
        let name = this.props.name;
        let unpicked = '';

        if (this.props.canEdit) {
            let games = flatten(this.props.rounds.slice(1));
            let totalGames = games.length;
            let picked = compact(games).length;
            unpicked = ' (' + picked + '/' + totalGames + ')';
        }

        return (
            <section className={'region ' + classes} data-id={this.props.id}>
                <h2 className='region-name'>{name + unpicked}</h2>
                <div className='rounds'>
                    <div className='rounds-scroll'>
                        {this.props.rounds.map((round, index) =>
                            <div key={index} className='round'>
                                {chunk(round, 2).map((matchup, index) =>
                                    <Matchup key={index} fromRegion={this.props.id} matchup={matchup} canEdit={this.props.canEdit} />
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
    propTypes: {
        bracket: PropTypes.object.isRequired,
        locked: PropTypes.bool.isRequired
    },

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

'use strict';

const React = require('react');
const {PropTypes} = React;
const classNames = require('classnames');

const chunk = require('lodash/array/chunk');
const has = require('lodash/object/has');
const flatten = require('lodash/array/flatten');
const compact = require('lodash/array/compact');

const bracketEntryActions = require('../../actions/bracketEntryActions');

const Team = React.createClass({
  propTypes: {
    canEdit: PropTypes.bool.isRequired,
    eliminated: PropTypes.bool,
    correct: PropTypes.bool,
    shouldBe: PropTypes.object,
    fromRegion: PropTypes.string,
    seed: PropTypes.number,
    name: PropTypes.string
  },

  handleClick(data) {
    const {fromRegion, seed, name} = data;
    if (fromRegion && seed && name) {
      bracketEntryActions.updateGame({
        fromRegion,
        winner: {seed, name}
      });
    }
  },

  render() {
    const aClasses = classNames({
      pickable: this.props.canEdit,
      eliminated: this.props.eliminated,
      correct: this.props.correct === true,
      incorrect: this.props.correct === false
    });
    const shouldBe = this.props.shouldBe;
    const shouldBeClasses = classNames({hide: !shouldBe});
    const {fromRegion, seed, name} = this.props;
    return (
      <li>
        <a
          onClick={this.handleClick.bind(null, this.props)}
          className={`team ${aClasses}`}
          data-region={fromRegion}
          data-seed={seed}
          data-name={name}
          data-id={fromRegion + seed}
        >
          <span className='seed'>{seed}</span>
          <span className='team-name'>{name}</span>
          <span className={`should-be ${shouldBeClasses}`}>
            <span className='seed'>{shouldBe ? shouldBe.seed : ''}</span>
            <span className='team-name'>{shouldBe ? shouldBe.name : ''}</span>
          </span>
        </a>
      </li>
    );
  }
});

const Matchup = React.createClass({
  propTypes: {
    matchup: PropTypes.array,
    key: PropTypes.number,
    canEdit: PropTypes.bool,
    fromRegion: PropTypes.string
  },

  render() {
    let {fromRegion} = this.props;
    const {matchup, key, canEdit} = this.props;
    const hasMatchup = has(matchup, '1');

        // The last team in each region is actually the final
        // so we update the fromRegion so it works with the updateGame action
    if (!hasMatchup) {
      fromRegion = 'FF';
    }

    const teams = [
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

const Region = React.createClass({
  propTypes: {
    'final': PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    rounds: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    canEdit: PropTypes.bool.isRequired
  },

  render() {
    const classes = classNames({
      'final-region': this.props.final,
      'initial-region': !this.props.final
    });
    const name = this.props.name;
    let unpicked = '';

    if (this.props.canEdit) {
      const games = flatten(this.props.rounds.slice(1));
      const totalGames = games.length;
      const picked = compact(games).length;
      unpicked = ` (${picked}/${totalGames})`;
    }

    return (
      <section className={`region ${classes}`} data-id={this.props.id}>
        <h2 className='region-name'>{name + unpicked}</h2>
        <div className='rounds'>
          <div className='rounds-scroll'>
            {this.props.rounds.map((round, roundIndex) =>
              <div key={roundIndex} className='round'>
                {chunk(round, 2).map((matchup, matchupIndex) =>
                  <Matchup key={matchupIndex} fromRegion={this.props.id} matchup={matchup} canEdit={this.props.canEdit} />
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
});

const Bracket = React.createClass({
  propTypes: {
    bracket: PropTypes.object.isRequired,
    locked: PropTypes.bool.isRequired
  },

  render() {
    const {locked, bracket} = this.props;
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
          <Region {...bracket.regionFinal} final canEdit={!locked} />
        </div>
      </div>
    );
  }
});

module.exports = Bracket;

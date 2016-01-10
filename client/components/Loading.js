'use strict';

const React = require('react');

const sample = require('lodash/collection/sample');
const phrases = [
  'Loading busted brackets',
  'Searching for a perfect bracket'
];

const Loading = React.createClass({
  render() {
    return (
      <div className='page-loader'>
        <h2>{sample(phrases)}...</h2>
        <div className='ball-container'>
          <div className='ball' />
        </div>
      </div>
    );
  }
});

module.exports = Loading;

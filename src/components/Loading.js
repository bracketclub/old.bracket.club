import React, {Component} from 'react';
import {sample} from 'lodash';

const phrases = [
  'Loading busted brackets',
  'Searching for a perfect bracket'
];

export default class Loading extends Component {
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
}

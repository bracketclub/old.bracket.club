'use strict';

let React = require('react');

let sample = require('lodash/collection/sample');
let phrases = [
    'Loading busted brackets',
    'Searching for a perfect bracket'
];


let Loading = React.createClass({
    render () {
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

let React = require('react');


let Loading = React.createClass({
    render () {
        return (
            <div className='page-loader'>
                <h2>Loading busted brackets</h2>
                <div className='ball-container'>
                    <div className='ball' />
                </div>
            </div>
        );
    }
});


module.exports = Loading;

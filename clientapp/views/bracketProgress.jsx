let React = require('react');

module.exports = React.createClass({
    render () {
        return (
            <div className='progress-holder'>
                <div className='progress progress-striped'>
                    <div className='progress-bar'
                        aria-valuenow={this.props.progress}
                        aria-valuemin='0'
                        aria-valuemax={this.props.progressTotal}
                        style={{width: this.props.percent + '%'}}></div>
                    <span className='progress-title'>
                        {this.props.progress} of {this.props.progressTotal} {this.props.progressText}
                    </span>
                </div>
            </div>
        );
    }
});
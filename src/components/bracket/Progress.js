import React, {Component, PropTypes} from 'react';
import {ProgressBar} from 'react-bootstrap';

export default class BracketProgress extends Component {
  static propTypes = {
    progress: PropTypes.object.isRequired,
    message: PropTypes.string.isRequired
  };

  render() {
    const {progress, message} = this.props;

    return (
      <div className='bracket-progress'>
        <ProgressBar
          striped
          now={progress.current}
          min={0}
          max={progress.total}
          label={`%(now)s of %(max)s ${message}`}
        />
      </div>
    );
  }
}

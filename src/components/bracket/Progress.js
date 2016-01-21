import React, {Component, PropTypes} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {ProgressBar} from 'react-bootstrap';

export default class BracketProgress extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

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

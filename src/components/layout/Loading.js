import React, {Component, PropTypes} from 'react';
import charCodes from 'lib/charCodes';

export default class Loading extends Component {
  static propTypes = {
    delayLoading: PropTypes.number
  };

  static defaultProps = {
    delayLoading: 200
  };

  constructor(props) {
    super(props);
    this.state = {showLoading: false};
  }

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    this.cancelTimer();
  }

  startTimer() {
    this.loadingTimeout = setTimeout(() => {
      this.setState({showLoading: true});
    }, this.props.delayLoading);
  }

  cancelTimer() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
  }

  render() {
    if (!this.state.showLoading) {
      return null;
    }

    return (
      <div className='page-loader'>
        <h2>Searching for a perfect bracket{charCodes.ellipsis}</h2>
        <div className='ball-container'>
          <div className='ball' />
        </div>
      </div>
    );
  }
}

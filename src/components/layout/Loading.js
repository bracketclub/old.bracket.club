import React, {Component, PropTypes} from 'react';

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

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    this.cancelTimer();
  }

  render() {
    if (!this.state.showLoading) {
      return null;
    }

    return (
      <div className='page-loader'>
        <h2>Searching for a perfect bracket{String.fromCharCode(8230)}</h2>
        <div className='ball-container'>
          <div className='ball' />
        </div>
      </div>
    );
  }
}

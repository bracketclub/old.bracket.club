import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import charCodes from 'lib/charCodes';
import styles from './index.less';

@CSSModules(styles)
export default class Loading extends Component {
  static propTypes = {
    delayLoading: PropTypes.number
  };

  static defaultProps = {
    delayLoading: 500
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
      <div styleName='page-loader'>
        <h2>Searching for a perfect bracket{charCodes.ellipsis}</h2>
        <div styleName='ball-container'>
          <div styleName='ball' />
        </div>
      </div>
    );
  }
}

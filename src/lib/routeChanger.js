import {Component} from 'react';
import PropTypes from 'prop-types';

// This is the hack to get event changes dispatched based on all history changes
export default class RouteChanger extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
  };

  componentWillMount() {
    this.unlisten = this.props.history.listen(this.props.onChange);
  }

  componentDidMount() {
    this.props.onChange(this.props.history.location);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    return this.props.children;
  }
}

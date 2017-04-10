import config from 'config';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';

const getDisplayName = (WrappedComponent) =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

export default (mapPropsToActions) => (WrappedComponent) => {
  class FetchOnUpdate extends Component {
    static propTypes = {
      dispatch: PropTypes.func.isRequired
    };

    static displayName = `FetchOnUpdate(${getDisplayName(WrappedComponent)})`;

    componentDidMount() {
      const {dispatch} = this.props;

      this.forEachAction(({key, action, param, sse}) => {
        dispatch(action(param));
        this.eventSource({key, param, sse});
      });
    }

    componentDidUpdate(prevProps) {
      const {dispatch} = this.props;
      const prevActions = mapPropsToActions(prevProps);

      this.forEachAction(({key, action, param, sse}) => {
        const prevParam = prevActions[key][1];
        if (param !== prevParam) {
          dispatch(action(param));
          this.eventSource({key, prevParam, param, sse});
        }
      });
    }

    componentWillUnmount() {
      this.forEachAction(({key, action, param}) => {
        this.eventSource({key, param});
      });
    }

    eventSource({key, prevParam, param, sse}) {
      if (config.sse) {
        const SSEKey = `_sse_${param}_${key}`;
        const prevSSEKey = `_sse_${prevParam}_${key}`;

        if (typeof this[SSEKey] === 'function') {
          this[SSEKey]();
        }

        if (typeof this[prevSSEKey] === 'function') {
          this[prevSSEKey]();
        }

        if (sse) {
          this[SSEKey] = this.props.dispatch(sse(param));
        }
      }
    }

    forEachAction(iterator) {
      const actions = mapPropsToActions(this.props);
      Object.keys(actions).forEach((key) => iterator({
        key,
        action: actions[key][0],
        param: actions[key][1],
        sse: actions[key][2]
      }));
    }

    render() {
      return (
        <WrappedComponent {...this.props} />
      );
    }
  }

  return hoistStatics(FetchOnUpdate, WrappedComponent);
};

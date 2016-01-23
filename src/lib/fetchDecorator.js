import React, {Component, PropTypes} from 'react';
import hoistStatics from 'hoist-non-react-statics';

const getDisplayName = (WrappedComponent) =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

export default (mapPropsToActions) => (WrappedComponent) => {
  class FetchOnUpdate extends Component {
    static propTypes = {
      dispatch: PropTypes.func.isRequired
    };

    componentDidMount() {
      const {dispatch} = this.props;
      const actions = mapPropsToActions(this.props);

      Object.keys(actions).forEach((key) => {
        const [action, param] = actions[key];
        dispatch(action(param));
      });
    }

    componentWillReceiveProps(nextProps) {
      const {dispatch} = this.props;
      const prevActions = mapPropsToActions(this.props);
      const actions = mapPropsToActions(nextProps);

      Object.keys(actions).forEach((key) => {
        const [action, param] = actions[key];
        if (param !== prevActions[key][1]) {
          dispatch(action(param));
        }
      });
    }

    render() {
      return (
        <WrappedComponent {...this.props} />
      );
    }
  }

  FetchOnUpdate.displayName = `FetchOnUpdate(${getDisplayName(WrappedComponent)})`;

  return hoistStatics(FetchOnUpdate, WrappedComponent);
};

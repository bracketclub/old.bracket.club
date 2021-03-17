import React, { Component } from 'react'
import PropTypes from 'prop-types'
import hoistStatics from 'hoist-non-react-statics'

const getDisplayName = (WrappedComponent) =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component'

export default (mapPropsToActions) => (WrappedComponent) => {
  class FetchOnUpdate extends Component {
    static propTypes = {
      dispatch: PropTypes.func.isRequired,
    }

    static displayName = `FetchOnUpdate(${getDisplayName(WrappedComponent)})`

    componentDidMount() {
      const { dispatch } = this.props

      this.forEachAction(({ key, action, param }) => {
        dispatch(action(param))
      })
    }

    componentDidUpdate(prevProps) {
      const { dispatch } = this.props
      const prevActions = mapPropsToActions(prevProps)

      this.forEachAction(({ key, action, param }) => {
        const prevParam = prevActions[key][1]
        if (param !== prevParam) {
          dispatch(action(param))
        }
      })
    }

    forEachAction(iterator) {
      const actions = mapPropsToActions(this.props)
      Object.keys(actions).forEach((key) =>
        iterator({
          key,
          action: actions[key][0],
          param: actions[key][1],
        })
      )
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  return hoistStatics(FetchOnUpdate, WrappedComponent)
}

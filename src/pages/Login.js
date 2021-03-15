import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PageHeader, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import qs from 'query-string'
import Page from '../components/layout/Page'
import * as meActionCreators from '../actions/me'
import * as meSelectors from '../selectors/me'

const mapStateToProps = (state, props) => ({
  redirect: qs.parse(props.location.search).redirect || '/',
  authenticating: meSelectors.authenticating(state, props),
})

const mapDispatchToProps = (dispatch) => ({
  meActions: bindActionCreators(meActionCreators, dispatch),
})

@connect(mapStateToProps, mapDispatchToProps)
export default class LoginPage extends Component {
  static propTypes = {
    redirect: PropTypes.string.isRequired,
    authenticating: PropTypes.bool,
  }

  handleLogin = () => {
    const { meActions, redirect } = this.props
    meActions.login({ redirect })
  }

  render() {
    const { authenticating } = this.props

    return (
      <Page>
        <PageHeader>Login Required</PageHeader>
        <p>You must be logged in with Twitter to view that page.</p>
        {authenticating ? (
          <Button disabled bsStyle="primary">
            Authenticating...
          </Button>
        ) : (
          <Button onClick={this.handleLogin} bsStyle="primary">
            Login
          </Button>
        )}
      </Page>
    )
  }
}

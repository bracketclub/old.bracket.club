import React, {Component, PropTypes} from 'react';
import {PageHeader, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {routerActions} from 'react-router-redux';

import Page from '../components/layout/Page';
import * as meActionCreators from '../actions/me';

const mapStateToProps = (state, props) => ({
  userId: state.me.id,
  redirect: props.location.query.redirect || '/',
  authenticating: !!state.me.authenticating
});

const mapDispatchToProps = (dispatch) => ({
  meActions: bindActionCreators(meActionCreators, dispatch),
  routerActions: bindActionCreators(routerActions, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
export default class LoginPage extends Component {
  static propTypes = {
    userId: PropTypes.string,
    redirect: PropTypes.string.isRequired,
    authenticating: PropTypes.bool.isRequired
  };

  componentWillMount() {
    this.redirectOnAuth(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.redirectOnAuth(nextProps);
  }

  redirectOnAuth(props) {
    const {userId, redirect, routerActions: {replace}} = props;

    if (userId) {
      replace(redirect);
    }
  }

  handleLogin = () => {
    const {meActions, redirect} = this.props;
    meActions.login({redirect});
  };

  render() {
    const {authenticating} = this.props;

    return (
      <Page>
        <PageHeader>Login Required</PageHeader>
        <p>You must be logged in with Twitter to view that page.</p>
        {authenticating
          ? <Button disabled bsStyle='primary'>Authenticating...</Button>
          : <Button onClick={this.handleLogin} bsStyle='primary'>Login</Button>
        }
      </Page>
    );
  }
}

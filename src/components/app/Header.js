/* global __EVENTS__ */

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import {Navbar, Nav, MenuItem, NavItem, NavDropdown} from 'react-bootstrap';

import eventDisplayName from '../../lib/eventDisplayName';

const events = __EVENTS__;

export default class Header extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    me: PropTypes.object,
    event: PropTypes.object,
    component: PropTypes.element
  };

  handleLogin = (e) => {
    e.preventDefault();
    this.props.onLogin();
  };

  handleLogout = (e) => {
    e.preventDefault();
    this.props.onLogout();
  };

  getMeDropdown() {
    const {me} = this.props;

    return (
      <NavDropdown title={me.username} id='me-nav'>
        <LinkContainer to={`users/${me.id}`}>
          <MenuItem>Bracket</MenuItem>
        </LinkContainer>
        <MenuItem divider />
        <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
      </NavDropdown>
    );
  }

  getEventPath = (e) => {
    const {component} = this.props;

    return component.getEventPath
      ? `/${component.getEventPath(e)}`
      : `/${e}`;
  };

  render() {
    const {me, event} = this.props;

    return (
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={`/${event.id}`}>TweetYourBracket</Link>
          </Navbar.Brand>
          <Nav className='year-nav'>
            <NavDropdown title={event.display} id='event-nav'>
              {events.map((e) =>
                <LinkContainer key={e} to={this.getEventPath(e)}>
                  <MenuItem>{eventDisplayName(e)}</MenuItem>
                </LinkContainer>
              )}
            </NavDropdown>
          </Nav>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <LinkContainer to='/subscribe'><NavItem>Subscribe</NavItem></LinkContainer>
            <LinkContainer to={`/${event.id}/entries`}><NavItem>Results</NavItem></LinkContainer>
            {me.id ? this.getMeDropdown() : <MenuItem key={1} onClick={this.handleLogin}>Login</MenuItem>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

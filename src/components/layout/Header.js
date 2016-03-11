/* global __EVENTS__ */

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import {Navbar, Nav, MenuItem, NavItem, NavDropdown} from 'react-bootstrap';

const {
  Header: NavbarHeader,
  Brand: NavbarBrand,
  Toggle: NavbarToggle,
  Collapse: NavbarCollapse
} = Navbar;

import eventDisplayName from 'lib/eventDisplayName';

const events = __EVENTS__;

export default class Header extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    me: PropTypes.object,
    event: PropTypes.object,
    component: PropTypes.func,
    eventPath: PropTypes.func
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
    const {me, eventPath, event} = this.props;

    return (
      <NavDropdown title={me.username} id='me-nav'>
        <LinkContainer to={eventPath ? `/${event.id}/entries/${me.id}` : `/users/${me.id}`}>
          <MenuItem>Bracket</MenuItem>
        </LinkContainer>
        <MenuItem divider />
        <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
      </NavDropdown>
    );
  }

  getEventPath(e) {
    const {eventPath} = this.props;

    return eventPath
      ? eventPath(e)
      : `/${e}`;
  }

  getEventTitle() {
    const {eventPath} = this.props;

    return eventPath
      ? this.props.event.display
      : 'Event';
  }

  render() {
    const {me, event} = this.props;

    return (
      <Navbar fluid>
        <NavbarHeader>
          <NavbarBrand>
            <Link to={`/${event.id}`}>
              <span className='hidden-xs'>tweetyourbracket</span>
              <span className='visible-xs-block'>tyb</span>
            </Link>
          </NavbarBrand>
          <Nav className='year-nav'>
            <NavDropdown title={this.getEventTitle()} id='event-nav'>
              {events.map((e) =>
                <LinkContainer onlyActiveOnIndex key={e} to={this.getEventPath(e)}>
                  <MenuItem>{eventDisplayName(e)}</MenuItem>
                </LinkContainer>
              )}
            </NavDropdown>
          </Nav>
          <NavbarToggle />
        </NavbarHeader>
        <NavbarCollapse>
          <Nav pullRight>
            <LinkContainer to='/faq'>
              <NavItem>FAQ</NavItem>
            </LinkContainer>
            <LinkContainer to='/subscribe'>
              <NavItem>Subscribe</NavItem>
            </LinkContainer>
            <LinkContainer to={`/${event.id}/entries`}>
              <NavItem>Results</NavItem>
            </LinkContainer>
            {me.id
              ? this.getMeDropdown()
              : <MenuItem onClick={this.handleLogin}>Login</MenuItem>
            }
          </Nav>
        </NavbarCollapse>
      </Navbar>
    );
  }
}

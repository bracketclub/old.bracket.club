import config from 'config';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap';
import {Navbar, Nav, NavItem, MenuItem, NavDropdown} from 'react-bootstrap';
import eventDisplayName from 'lib/eventDisplayName';

const NavbarHeader = Navbar.Header;
const NavbarBrand = Navbar.Brand;
const NavbarToggle = Navbar.Toggle;
const NavbarCollapse = Navbar.Collapse;

export default class Header extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    me: PropTypes.object,
    event: PropTypes.object,
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
        <LinkContainer to={`/users/${me.id}`}>
          <NavItem>Profile</NavItem>
        </LinkContainer>
        {eventPath &&
          <LinkContainer to={`/${event.id}/entries/${me.id}`}>
            <NavItem>Bracket</NavItem>
          </LinkContainer>
        }
        <MenuItem divider />
        <NavItem onClick={this.handleLogout}>Logout</NavItem>
      </NavDropdown>
    );
  }

  getEventPath(event) {
    const {eventPath} = this.props;
    return eventPath ? eventPath(event) : `/${event}`;
  }

  getEventTitle() {
    const {eventPath} = this.props;
    return eventPath ? this.props.event.display : 'Event';
  }

  render() {
    const {me, event} = this.props;

    return (
      <Navbar fluid>
        <NavbarHeader>
          <NavbarBrand>
            <Link to={`/${event.id}`}>
              <span className='hidden-xs'>bracketclub</span>
              <span className='visible-xs-block'>BC</span>
            </Link>
          </NavbarBrand>
          <Nav className='year-nav'>
            <NavDropdown title={this.getEventTitle()} id='event-nav'>
              {config.events.map((eventNav) => (
                <IndexLinkContainer key={eventNav} to={this.getEventPath(eventNav)}>
                  <NavItem>{eventDisplayName(eventNav)}</NavItem>
                </IndexLinkContainer>
              ))}
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
              : <NavItem onClick={this.handleLogin}>Login</NavItem>
            }
          </Nav>
        </NavbarCollapse>
      </Navbar>
    );
  }
}

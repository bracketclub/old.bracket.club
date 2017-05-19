import config from 'config';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap';
import {Navbar, Nav, NavItem, MenuItem, NavDropdown} from 'react-bootstrap';
import mapSelectorsToProps from 'lib/mapSelectorsToProps';
import mapDispatchToProps from 'lib/mapDispatchToProps';
import eventDisplayName from 'lib/eventDisplayName';
import * as eventSelectors from '../../selectors/event';
import * as meSelectors from '../../selectors/me';
import * as meActions from '../../actions/me';
import {getEventPath} from '../../routes';

const NavbarHeader = Navbar.Header;
const NavbarBrand = Navbar.Brand;
const NavbarToggle = Navbar.Toggle;
const NavbarCollapse = Navbar.Collapse;

const mapStateToProps = mapSelectorsToProps({
  event: eventSelectors.info,
  me: meSelectors.me
});

@withRouter
@connect(mapStateToProps, mapDispatchToProps({meActions}))
export default class Header extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    me: PropTypes.object,
    event: PropTypes.object
  };

  handleLogin = (e) => {
    e.preventDefault();
    this.props.meActions.onLogin();
  };

  handleLogout = (e) => {
    e.preventDefault();
    this.props.meActions.onLogout();
  };

  getMeDropdown() {
    const {me, event} = this.props;
    const eventPath = this.getEventPath();

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
    return getEventPath(this.props.location)(event);
  }

  getEventLink(event) {
    return this.getEventPath(event) || `/${event}`;
  }

  getEventTitle() {
    return this.getEventPath() ? this.props.event.display : 'Event';
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
                <IndexLinkContainer key={eventNav} to={this.getEventLink(eventNav)}>
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

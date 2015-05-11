'use strict';

let React = require('react');
let {Link} = require('react-router');

let extend = require('lodash/object/extend');
let partial = require('lodash/function/partial');

let Navbar = require('react-bootstrap/lib/Navbar');
let Nav = require('react-bootstrap/lib/Nav');
let MenuItem = require('react-bootstrap/lib/MenuItem');
let DropdownButton = require('react-bootstrap/lib/DropdownButton');

let NavItemLink = require('react-router-bootstrap/lib/NavItemLink');
let MenuItemLink = require('react-router-bootstrap/lib/MenuItemLink');

let meActions = require('../../actions/meActions');

// This is a bit of a pain, but there exist links in the app to change the
// current page to a different year. We need to know how to convert any pathname
// to a different year. This needs to be kept consistent with the ./routes.jsx file.
// TODO: find a way to automatically determine from routes
let years = require('../../global').years.slice(0).reverse();
let yearRoutes = ['user', 'results', 'resultsCurrent', 'userCurrent'];
let defaultTo = 'landing';
let yearParamNames = {landing: 'path'};


let Header = React.createClass({

    contextTypes: {
        router: React.PropTypes.func
    },

    getYearPathname () {

        let route = this.context.router.getCurrentRoutes()[1];
        let params = this.context.router.getCurrentParams();
        let query = this.context.router.getCurrentQuery();

        let sendTo = yearRoutes.indexOf(route.name) > -1 ? route.name.replace('Current', '') : defaultTo;
        let yearParamName = yearParamNames[sendTo] || 'year';

        let addYear = (obj, year) => {
            let toAdd = {[yearParamName]: year};
            return extend({}, obj, toAdd);
        };

        return {
            to: sendTo,
            query: query, // TODO: maybe need to only send certain query params to landing page
            params: partial(addYear, sendTo === defaultTo ? {} : params)
        };
    },

    propTypes: {
        me: React.PropTypes.object,
        year: React.PropTypes.string.isRequired
    },

    handleLogin (e) {
        e.preventDefault();
        meActions.auth();
    },

    handleLogout (e) {
        e.preventDefault();
        meActions.logout();
    },

    render () {
        let {me, year} = this.props;
        let {to, params, query} = this.getYearPathname();

        return (
            <header>
                <Navbar brand={<Link to='app'>TweetYourBracket</Link>} toggleNavKey={1} fluid>
                    <Nav className='year-nav'>
                        <DropdownButton title={year}>
                            {years.map((dropdownYear) =>
                                <MenuItemLink key={dropdownYear} to={to} params={params(dropdownYear)} query={query}>
                                    {dropdownYear}
                                </MenuItemLink>
                            )}
                        </DropdownButton>
                    </Nav>
                    <Nav eventKey={1} right={true}>
                        <NavItemLink to='subscribe'>Subscribe</NavItemLink>
                        <NavItemLink to='resultsCurrent'>Results</NavItemLink>
                        {[me.id ? <DropdownButton key={0} title={me.username}>
                            <MenuItemLink to='userCurrent' params={{id: me.id}}>Bracket</MenuItemLink>
                            <MenuItem divider />
                            <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                        </DropdownButton> : <MenuItem key={1} onClick={this.handleLogin}>Login</MenuItem>]}
                    </Nav>
                </Navbar>
            </header>
        );
    }
});

module.exports = Header;

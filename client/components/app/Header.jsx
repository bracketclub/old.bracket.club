let React = require('react');
let {Link} = require('react-router');

let Navbar = require('react-bootstrap/lib/Navbar');
let Nav = require('react-bootstrap/lib/Nav');
let MenuItem = require('react-bootstrap/lib/MenuItem');
let DropdownButton = require('react-bootstrap/lib/DropdownButton');

let NavItemLink = require('react-router-bootstrap/lib/NavItemLink');
let MenuItemLink = require('react-router-bootstrap/lib/MenuItemLink');

let meActions = require('../../actions/meActions');

let years = require('../../global').years.slice(0).reverse();
let YearPathnameMixin = require('../../helpers/YearPathnameMixin');


let Header = React.createClass({
    mixins: [YearPathnameMixin],

    propTypes: {
        me: React.PropTypes.object,
        year: React.PropTypes.string.isRequired,
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
                            {years.map(year =>
                                <MenuItemLink key={year} to={to} params={params(year)} query={query}>
                                    {year}
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

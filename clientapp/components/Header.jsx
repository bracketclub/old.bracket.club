let React = require('react');
let {Link} = require('react-router');

let Navbar = require('react-bootstrap/lib/Navbar');
let Nav = require('react-bootstrap/lib/Nav');
let MenuItem = require('react-bootstrap/lib/MenuItem');
let DropdownButton = require('react-bootstrap/lib/DropdownButton');

let NavItemLink = require('react-router-bootstrap/lib/NavItemLink');
let MenuItemLink = require('react-router-bootstrap/lib/MenuItemLink');

let meActions = require('../actions/meActions');
let globalDataActions = require('../actions/globalDataActions');

let meStore = require('../stores/meStore');
let globalDataStore = require('../stores/globalDataStore');

let {years} = require('../global');


let Header = React.createClass({
    componentWillMount() {
        globalDataStore.listen(this.onChange);
        meStore.listen(this.onChange);
    },

    componentWillUnmount () {
        globalDataStore.unlisten(this.onChange);
        meStore.unlisten(this.onChange);
    },

    getInitialState () {
        let {year} = globalDataStore.getState();
        let {id, username} = meStore.getState();
        return {year, id, username};
    },

    onChange () {
        this.setState(this.getInitialState());
    },

    onClickYear (year) {
        globalDataActions.updateYear(year);
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
        return (
            <header>
                <Navbar brand={<Link to='app'>TweetYourBracket</Link>} toggleNavKey={1} fluid>
                    <Nav eventKey={1} right={true}>
                        <DropdownButton title={this.state.year}>
                            {years.slice(0).reverse().map(year => <MenuItem key={year} onClick={this.onClickYear.bind(null, year)}>{year}</MenuItem>)}
                        </DropdownButton>
                        <NavItemLink to='subscribe'>Subscribe</NavItemLink>
                        <NavItemLink to='results'>Results</NavItemLink>
                        {[this.state.id ? <DropdownButton key={0} title={this.state.username}>
                            <MenuItemLink to='user' params={{id: this.state.id}}>Bracket</MenuItemLink>
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

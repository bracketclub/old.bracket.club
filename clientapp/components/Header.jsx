let React = require('react');
let {Link} = require('react-router');

let Navbar = require('react-bootstrap/lib/Navbar');
let Nav = require('react-bootstrap/lib/Nav');
let MenuItem = require('react-bootstrap/lib/MenuItem');
let DropdownButton = require('react-bootstrap/lib/DropdownButton');

let NavItemLink = require('react-router-bootstrap/lib/NavItemLink');
let MenuItemLink = require('react-router-bootstrap/lib/MenuItemLink');


let Header = React.createClass({
    render () {
        return (
            <header>
                <Navbar fixedTop={true} brand={<Link to='app'>TweetYourBracket</Link>} toggleNavKey={1} fluid={true}>
                    <Nav eventKey={1} right={true}>
                        <NavItemLink to='emptyBracket'>New Bracket</NavItemLink>
                        <NavItemLink to='subscribe'>Subscribe</NavItemLink>
                        <NavItemLink to='results'>Results</NavItemLink>
                        {(this.props.user ? <DropdownButton title={this.props.user}>
                            <MenuItemLink to='user' params={{user: this.props.user}}>Bracket</MenuItemLink>
                            <MenuItem divider />
                            <MenuItem>Logout</MenuItem>
                        </DropdownButton> : <MenuItem>Login</MenuItem>)}
                    </Nav>
                </Navbar>
            </header>
        );
    }
});

module.exports = Header;

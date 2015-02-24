let React = require('react');
let {Navbar, Nav, MenuItem, DropdownButton} = require('react-bootstrap');
let {NavItemLink, MenuItemLink} = require('react-router-bootstrap');


let Header = React.createClass({
    render () {
        return (
            <header>
                <Navbar fixedTop={true} brand='TweetYouBracket' toggleNavKey={1} fluid={true}>
                    <Nav eventKey={1} right={true}>
                        <NavItemLink to='subscribe'>Subscribe</NavItemLink>
                        <NavItemLink to='results'>Results</NavItemLink>
                        {(this.props.user ? <DropdownButton title={this.props.user}>
                            <MenuItemLink to='user' params={{user: this.props.user}}>Bracket</MenuItemLink>
                            <MenuItem divider />
                            <MenuItemLink to='logout'>Logout</MenuItemLink>
                        </DropdownButton> : <MenuItem>Login</MenuItem>)}
                    </Nav>
                </Navbar>
            </header>
        );
    }
});

module.exports = Header;

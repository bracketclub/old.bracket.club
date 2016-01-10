'use strict';

const React = require('react');
const {Link} = require('react-router');

module.exports = React.createClass({
  render() {
    return (
      <div>
        <h2>Page not found</h2>
        <p>Whoops, something went wrong, which is totally my bad.</p>
        <p>
          Not sure exactly how this happened, but you're best bet would be to head back to the <Link to='app'>home page</Link>. That's where most of the cool stuff is.
        </p>
      </div>
    );
  }
});

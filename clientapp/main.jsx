let app = require('./app.js');
let React = require('react');
let {run, HistoryLocation, Route, Link, RouteHandler, DefaultRoute, NotFoundRoute} = require('react-router');

// Pages
let {Entry, User, FourOhFour} = require('./pages');

let App = React.createClass({
    render () {
        return (
        <div>
            <header>
                <ul>
                    <li><Link to="app">TweetYourBracket</Link></li>
                    <li><Link to="user">User</Link></li>
                    <li><Link to="bracket" params={{bracket: app.data.constants.EMPTY}}>Bracket</Link></li>
                </ul>
            </header>
            <RouteHandler/>
        </div>
        );
    }
});

run(
    (<Route name="app" path="/" handler={App}>
        <Route name="user" handler={User} />
        <Route name="bracket" path="bracket/:bracket" handler={Entry} ignoreScrollBehavior={true} />
        <DefaultRoute handler={Entry} />
        <NotFoundRoute handler={FourOhFour} />
    </Route>),
    HistoryLocation,
    function (Handler) {
        React.render(<Handler/>, document.body);
    }
);




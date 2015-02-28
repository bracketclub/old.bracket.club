let React = require('react');
let Router = require('react-router');
let {HistoryLocation, Redirect, Route, DefaultRoute, NotFoundRoute} = Router;

let app = require('./app');
let Pages = require('./pages');
let App = require('./components/App');

let routes = (
    <Route name="app" path="/" handler={App}>
        <Route name="emptyBracket" path="bracket" handler={Pages.Entry} ignoreScrollBehavior={true}>
            <Route name="bracket" path=":bracket" handler={Pages.Entry} />
        </Route>

        <Route name="results" path='results' handler={Pages.Results} />
        <Redirect from="users" to='results' />

        <Route name="user" path="users/:user" handler={Pages.User} />
        <Route name="subscribe" handler={Pages.Subscribe} />

        <DefaultRoute handler={Pages.Entry} />
        <NotFoundRoute handler={Pages.FourOhFour} />
    </Route>
);


Router.run(routes, HistoryLocation, function (Handler) {
    React.render(<Handler {...app} />, document.body);
});

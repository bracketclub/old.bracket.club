let app = require('./app');
let React = require('react');
let Router = require('react-router');
let {HistoryLocation, Route, RouteHandler, DefaultRoute, NotFoundRoute} = Router;

// Components
let {Header, Footer} = require('./components');

// Pages
let {Entry, User, FourOhFour} = require('./pages');

let App = React.createClass({
    render () {
        return (
        <div>
            <Header {...this.props} />
            <div className='container'>
                <RouteHandler />
                <Footer {...this.props} />
            </div>
        </div>
        );
    }
});

let Routes = (
    <Route name="app" path="/" handler={App}>
        <Route name="user" path='user/:user' handler={User} />
        <Route name="bracket" path="bracket/:bracket" handler={Entry} ignoreScrollBehavior={true} />
        <Route name="subscribe" handler={User} />
        <Route name="results" handler={User} />
        <Route name="logout" handler={User} />
        <DefaultRoute handler={Entry} />
        <NotFoundRoute handler={FourOhFour} />
    </Route>
);

Router.run(Routes, HistoryLocation, function (Handler) {
    React.render(<Handler user='lukekarrys' lastUpdated={app.lastUpdated} />, document.body);
});

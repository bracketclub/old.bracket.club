let app = require('./app');
let React = require('react');
let Router = require('react-router');
let {State, HistoryLocation, Route, RouteHandler, DefaultRoute, NotFoundRoute} = Router;

// Components
let {Header, Footer} = require('./components');

// Pages
let {Entry, User, FourOhFour} = require('./pages');

let App = React.createClass({
    mixins: [State],
    getHandlerKey () {
        var key = this.getRoutes()[1].name;
        var id = this.getParams().id;
        if (id) { key += id; }
        return key || 'root';
    },
    useFluidContainer () {
        var key = this.getHandlerKey();
        return key === 'root' || key === 'bracket';
    },
    render () {
        return (
        <div>
            <Header {...this.props} />
            <div className={this.useFluidContainer() ? 'container-fluid' : 'container'}>
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

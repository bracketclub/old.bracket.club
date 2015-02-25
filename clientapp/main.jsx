let app = require('./app');
let React = require('react');
let Router = require('react-router');
let {State, Redirect, HistoryLocation, Route, RouteHandler, DefaultRoute, NotFoundRoute} = Router;

// Components
let {Header, Footer} = require('./components');

// Pages
let Pages = require('./pages');

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
        return !!key.match(/^(emptyBracket|bracket|root|user)$/i);
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

Router.run(Routes, HistoryLocation, function (Handler) {
    React.render(<Handler user='lukekarrys' lastUpdated={app.lastUpdated} />, document.body);
});

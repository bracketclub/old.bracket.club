// The trick is to assign module.exports before any require()s
// https://github.com/rackt/react-router/blob/master/docs/guides/flux.md

var router;

module.exports = {
    makePath (to, params, query) {
        return router.makePath(to, params, query);
    },

    makeHref (to, params, query) {
        return router.makeHref(to, params, query);
    },

    transitionTo (to, params, query) {
        router.transitionTo(to, params, query);
    },

    replaceWith (to, params, query) {
        router.replaceWith(to, params, query);
    },

    goBack () {
        router.goBack();
    },

    run (render) {
        router.run(render);
    },

    fullWidthRoutes: ['user', 'userCurrent', 'landing', 'entry']
};


// By the time route config is require()-d,
// require('./router') already returns a valid object

let React = require('react');
let Router = require('react-router');
let {HistoryLocation, Redirect, Route, NotFoundRoute} = Router;

let Pages = require('./pages');
let App = require('./components/App');
let routes = (
    <Route name='app' path='/' handler={App}>
        <Route name='subscribe' path='subscribe' handler={Pages.Subscribe} />

        <Route name='resultsCurrent' path='results' handler={Pages.Results} />
        <Route name='results' path='results/:year?' handler={Pages.Results} />
        <Redirect from='users' to='results' />

        <Route name='userCurrent' path='users/:id' handler={Pages.User} />
        <Route name='userProfile' path='users/:id/profile' handler={Pages.UserProfile} />
        <Route name='user' path='users/:id/:year?' handler={Pages.User} />

        <Route name='entry' path=':year/:bracket' handler={Pages.CreatedEntry} />
        <Route name='landing' path=':path?' handler={Pages.Landing} ignoreScrollBehavior={true} />

        <NotFoundRoute handler={Pages.FourOhFour} />
    </Route>
);

router = Router.create({
    routes: routes,
    location: HistoryLocation
});
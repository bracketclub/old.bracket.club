import {UserAuthWrapper} from 'redux-auth-wrapper';
import {routerActions} from 'react-router-redux';
import App from './components/connected/App';
import Subscribe from './pages/Subscribe';
import Login from './pages/Login';
import Results from './pages/Results';
import UserEntry from './pages/UserEntry';
import UserProfile from './pages/UserProfile';
import CreatedEntry from './pages/CreatedEntry';
import MasterBracket from './pages/MasterBracket';
import LiveEntry from './pages/LiveEntry';
import FourOhFour from './pages/FourOhFour';
import Countdown from './pages/Countdown';
import FAQ from './pages/FAQ';
import Zentry from './pages/Zentry';

const Auth = UserAuthWrapper({
  authSelector: (state) => state.me,
  predicate: (auth) => auth.id,
  authenticatingSelector: (state) => state.me.authenticating,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'Auth'
});

const indexRoute = {
  components: {
    lockedComponent: MasterBracket,
    unlockedComponent: LiveEntry
  }
};

const eventRoutes = {
  // This needs to come last since the eventId is a param that would
  // otherwise match any path
  path: ':eventId',
  indexRoute,
  childRoutes: [
    {path: 'zen', component: Zentry},
    {path: 'countdown', component: Countdown},
    {path: 'entries', component: Results},
    {path: 'entries/friends', component: Auth(Results)},
    {path: 'entries/:userId', component: UserEntry},
    // These are the links the get posted to twitter
    {path: 'entry/:bracket', component: CreatedEntry},
    // These are the local url during a live entry, might as well render
    // this as an entry if it gets loaded
    {
      path: ':bracket',
      components: {
        lockedComponent: CreatedEntry,
        unlockedComponent: LiveEntry
      }
    }
  ]
};

export default {
  path: '/',
  component: App,
  // The landing page is accessible without an eventId because it defaults
  // to the active event from the env variables injected by webpack
  indexRoute,
  childRoutes: [
    // Static pages
    {path: 'subscribe', component: Subscribe},
    {path: 'login', component: Login},
    {path: 'faq', component: FAQ},
    // A user profile page doesnt need to live at an event url
    {path: 'users/:userId', component: UserProfile},
    eventRoutes,
    {path: '*', component: FourOhFour}
  ]
};

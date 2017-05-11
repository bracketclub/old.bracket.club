import {matchPath} from 'react-router-dom';
import {pick} from 'lodash';
import * as meSelectors from './selectors/me';
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

// By default if a route is missing an eventPath, it will link each event to /:eventId
// Otherwise it will use this function which will replace all the params with the match
// and pass through the location.search
const eventPath = function ({path, location, match}) {
  const {search} = location;
  const {params} = match;
  return (event) => ({
    search,
    pathname: (!path || path === '/' ? '/:eventId' : path)
      .replace(':eventId', event)
      .replace(/\/(:\w+)/g, (__, name) => `/${params[name.slice(1)]}`)
  });
};

const routes = [
  {
    exact: true,
    path: '/',
    component: (locked) => locked ? MasterBracket : LiveEntry,
    eventPath
  },
  {
    exact: true,
    path: '/subscribe',
    component: Subscribe
  },
  {
    exact: true,
    path: '/faq',
    component: FAQ
  },
  {
    exact: true,
    path: '/login',
    component: meSelectors.NotAuthed(Login)
  },
  {
    exact: true,
    path: '/users/:userId',
    component: UserProfile
  },
  {
    exact: true,
    path: '/:eventId',
    component: (locked) => locked ? MasterBracket : LiveEntry,
    eventPath
  },
  {
    exact: true,
    path: '/:eventId/zen',
    component: Zentry,
    eventPath
  },
  {
    exact: true,
    path: '/:eventId/countdown',
    component: Countdown,
    eventPath
  },
  {
    exact: true,
    path: '/:eventId/entries',
    component: Results,
    eventPath
  },
  {
    exact: true,
    path: '/:eventId/entries/friends',
    component: meSelectors.Authed(Results),
    eventPath
  },
  {
    exact: true,
    path: '/:eventId/entry/:bracket',
    component: UserEntry,
    eventPath
  },
  {
    exact: true,
    path: '/:eventId/:bracket',
    component: (locked) => locked ? CreatedEntry : LiveEntry,
    eventPath
  },
  {
    component: FourOhFour
  }
];

export const getEventPath = (location) => {
  for (let i = 0, m = routes.length; i < m; i++) {
    const route = routes[i];
    const match = matchPath(location.pathname, pick(route, 'path', 'exact', 'strict'));
    if (match && route.eventPath) {
      return route.eventPath({path: route.path, location, match});
    }
  }
  return null;
};

export default routes;

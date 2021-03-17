export default {
  sport: 'ncaam',
  year: '2021',
  navEvents: ['ncaam-2021', 'ncaaw-2021'],
  events: [
    'ncaam-2021',
    'ncaaw-2021',
    'ncaam-2019',
    'ncaaw-2019',
    'wcm-2018',
    'nba-2018',
    'nhl-2018',
    'ncaam-2018',
    'ncaaw-2018',
    'nba-2017',
    'nhl-2017',
    'ncaam-2017',
    'ncaaw-2017',
    'nba-2016',
    'nhl-2016',
    'ncaam-2016',
    'ncaaw-2016',
    'ncaam-2015',
    'ncaam-2014',
    'ncaam-2013',
    'ncaam-2012',
  ],
  sse:
    // SSE is broken when there are multiple live events. Safari on iOS
    // hits a connection-per-host limit at 6, so in practice with 2 live
    // events and they each open two SSE streams (scores and entries), the
    // request limit will be reached on the results page where two more requests
    // are made. The solution should be to open a single SSE stream and then conditionally
    // fetch based on the events/data received, but for now the architecture makes
    // some assumptions that make that difficult.
    typeof window.localStorage !== 'undefined' &&
    window.localStorage.getItem('sse') === 'true',
  static: false,
  localStorage: 'bracketclub',
  baseUrl: 'bracket.club',
  twitter: {
    handle: 'bracketclub',
    hashtag: 'bracketclub',
    text: {
      wcm: 'I tweeted my #worldcup bracket!',
      wcw: 'I tweeted my #worldcup bracket!',
      ncaam: 'I tweeted my #marchmadness bracket!',
      ncaaw: 'I tweeted my Women’s #marchmadness bracket!',
      nba: 'I tweeted my #nbaplayoffs bracket',
      nhl: 'I tweeted my #nhlplayoffs bracket',
    },
  },
  mailchimp: {
    url: 'https://tweetyourbracket.us5.list-manage.com/subscribe/post',
    u: '3357cbc15c95f163a6fff3a84',
    id: '2259ac644a',
  },
}

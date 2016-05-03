import qs from 'query-string';

export default ({event, bracket}) => {
  const tweetQs = qs.stringify({
    text: 'I tweeted my #marchmadness bracket!',
    url: `http://tweetyourbracket.com/${event.id}/entry/${bracket}`,
    hashtags: 'tybrkt',
    lang: 'en',
    related: 'tweetthebracket',
    via: 'tweetthebracket',
    count: 'none'
  });

  return `https://twitter.com/share?${tweetQs}`;
};

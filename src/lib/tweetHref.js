import config from 'config';
import qs from 'query-string';

export default ({event, bracket}) => {
  const tweetQs = qs.stringify({
    text: 'I tweeted my #marchmadness bracket!',
    url: `https://${config.baseUrl}/${event.id}/entry/${bracket}`,
    hashtags: config.twitter.hashtag,
    lang: 'en',
    related: config.twitter.handle,
    via: config.twitter.handle,
    count: 'none'
  });

  return `https://twitter.com/share?${tweetQs}`;
};

import config from 'config';
import qs from 'query-string';

export default ({event, bracket}) => {
  const tweetQs = qs.stringify({
    text: 'I tweeted my #marchmadness bracket!',
    url: `https://${config.baseUrl}/${event.id}/entry/${bracket}`,
    hashtags: config.tweetTag,
    lang: 'en',
    related: config.twitterHandle,
    via: config.twitterHandle,
    count: 'none'
  });

  return `https://twitter.com/share?${tweetQs}`;
};

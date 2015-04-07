# tweetyourbracket.com

[tweetyourbracket.com](http://tweetyourbracket.com)

[![Join the chat at https://gitter.im/tweetyourbracket/tweetyourbracket.com](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/tweetyourbracket/tweetyourbracket.com?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[ ![Codeship Status for tweetyourbracket/tweetyourbracket.com](https://codeship.com/projects/0e37aee0-7e64-0132-b96b-56aeae6c129c/status?branch=master)](https://codeship.com/projects/56987)


### Structure

This is mostly written for myself since I work on the project once a year for
about a month. *(Hi future Luke!)* Hopefully in 2016 I will remember why things
went where they did and how things works.


### Fetching API Data

During the "off-season" the site has no need for a real API since data won't change until the next year. After the end of each year, we switch the `codeship-setup` npm run-script to use `build-static` instead of `build`.

This will make the site load the data from `cdn.rawgit.com` instead of [`tweetyourbracket.com/api`]('https://github.com/tweetyourbracket/api'). When it comes time to launch the site again each March, we use `npm run build` again and go follow the instructions over at the `api` repo to deploy the whole thing on Digital Ocean (or something similar).


### Styles

### Components

### Webpack

### Build

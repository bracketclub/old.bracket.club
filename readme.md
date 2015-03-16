# tweetyourbracket.com

[tweetyourbracket.com](http://tweetyourbracket.com)

[![Join the chat at https://gitter.im/tweetyourbracket/tweetyourbracket.com](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/tweetyourbracket/tweetyourbracket.com?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[ ![Codeship Status for tweetyourbracket/tweetyourbracket.com](https://codeship.com/projects/0e37aee0-7e64-0132-b96b-56aeae6c129c/status?branch=master)](https://codeship.com/projects/56987)


### Structure

This is mostly written for myself since I work on the project once a year for
about a month. *(Hi future Luke!)* Hopefully in 2016 I will remember why things
went where they did and how things works.


### Styles

The CSS is built on top of Bootstrap using the [Bootswatch United theme](https://bootswatch.com/united/). App specific styles are located in `styles/app/`. The whole thing is built from the npm installed bootstrap module inside `lib/config.js#beforeBuildCSS` using [`lessitizer`]() and [`less-import-inserter`]().



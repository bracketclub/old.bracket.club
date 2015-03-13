# Tweet Your Bracket

[tweetyourbracket.com](http://tweetyourbracket.com)


### Structure

This is mostly written for myself since I work on the project once a year for
about a month. *(Hi future Luke!)* Hopefully in 2016 I will remember why things
went where they did and how things works.


### Styles

The CSS is built on top of Bootstrap using the [Bootswatch United theme](https://bootswatch.com/united/). App specific styles are located in `styles/app/`. The whole thing is built from the npm installed bootstrap module inside `lib/config.js#beforeBuildCSS` using [`lessitizer`]() and [`less-import-inserter`]().
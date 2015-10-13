# tweetyourbracket.com

[tweetyourbracket.com](http://tweetyourbracket.com)

[ ![Codeship Status for tweetyourbracket/tweetyourbracket.com](https://codeship.com/projects/0e37aee0-7e64-0132-b96b-56aeae6c129c/status?branch=master)](https://codeship.com/projects/56987)



## Structure

This is mostly written for myself since I work on the project once a year for about a month. *(Hi future Luke!)* Hopefully in 2016 I will remember why things went where they did and how things works.



### Fetching API Data

During the "off-season" the site has no need for a real API since data won't change until the next year. After the end of each year, we switch the `codeship-setup` npm run-script to use `build-static` instead of `build`.

This will make the site load the data from `cdn.rawgit.com` instead of [`tweetyourbracket.com/api`]('https://github.com/tweetyourbracket/api'). When it comes time to launch the site again each March, we use `npm run build` again and go follow the instructions over at the `api` repo to deploy the whole thing on Digital Ocean (or something similar).



### Flux

The app is using Alt as the Flux implementation. I like it due to the lack of boilerplate.

#### Actions/Stores

**`bracketEntry`**

These actions are used while bracket entries are open. They are used to track the picks and history of each pick during the bracket entry selection.

**`entry`**

These are the entries for each year. They are used to fetch entries and respond to loading and errors.

**`master`**

These are the master brackets for each year. They are used to fetch the master brackets and respon to loading and erros.

**`globalData`**

The global data is the current year and sport (which is always the same for now) of the bracket being viewed. It also determines whether a certain bracket is locked.

**`me`**

Used to auth with Firebase and get the current active user.



### Styles

The app uses Bootstrap and Bootswatch which are installed via npm. There is a build file at `styles/index.less` which creates a string of valid Less which is a list of all the less imports used by the site. It modifies the main bootstrap less file with the necessary imports from the bootswatch theme and also imports `styles/app/app.less`.

The styles are built with the Webpack loaders `style!css!postcss!less!val`. The style loader injects the CSS into the document while in development. Some of those are configured by [`hjs-webpack`](https://github.com/henrikjoreteg/hjs-webpack) but we need to do it again here so that the extract text stuff is all in one place and we have to use `val-loader` which takes the built Less string and passes it to the next loader.

In production, we use the `extract-text-webpack-plugin` to take the all the css and split it into a single bundle which gets saved to the build directory.



### Webpack + Building

`development` via `npm start`

This uses `webpack-dev-server` to serve the content from the `webpack.config.es6` via [`hjs-webpack`](https://github.com/henrikjoreteg/hjs-webpack). It enables hot module reloading and a few other nice to haves.

`production` via `npm run build`

This builds the JS and CSS bundles and am html file via [`hjs-webpack`](https://github.com/henrikjoreteg/hjs-webpack) to the `build/` directory. It also copies any other assets required throughout the app via the `file-loader`.



### Deployment

Codeship + Surge.

Codeship is hooked up to the repo to process all pushes. `npm run codeship-setup` and `npm run codeship-test` and run to get the set ready for deployment. Pushes on the master branch go to production. Currently pushes on the development branch don't trigger builds.

All urls are set to be caught by the `200.html` file. And the bundled CSS and JS filenames are fingerprinted with the hash of the file contents from Webpack.



### Routing

The app uses `react-router`. Since the app also uses a Flux implementation, we are using a container for the router instance as described in the [React Router Flux examples](https://github.com/rackt/react-router/blob/f3a44f1bc898848d553c39e7aa53a70d0e91ec11/docs/guides/flux.md#circular-dependencies-in-actions). This is necessary so that in the `bracketEntryStore` we can trigger a route repl



### React

**Pages** client/pages/

Pages are components that are called directly by the RouteHandler in `react-router`. We are only nesting a single level deep at the moment, so it makes sense to keep the all the top-level pages organized and everything else goes in `components/`.

**Bracket components** client/components/brackets/

These are the components that build a bracket. There is the bracket itself, the progess bar, the navigation for traversing the bracket history, and a bunch of other stuff.

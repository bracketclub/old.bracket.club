## Structure

This is mostly written for myself since I work on the project once a year for about a month. _(Hi future Luke!)_ Hopefully in 2016 I will remember why things went where they did and how things works.

### Fetching API Data

During the "off-season" the site has no need for a real API since data won't change until the next year. After the end of each year, we switch the `built` npm run-script to add `CONFIG_ENV=static`. We can also go over the to [`api`](https://github.com/bracketclub/api) and run `NODE_ENV=production npm run export` and it will export all the data to this repo.

This will make the site build with the static data and request it from the local domain instead of the api. When it comes time to launch the site again each March, we set `CONFIG_ENV=production` again and go follow the instructions over at the `api` repo to deploy the whole thing on Digital Ocean (or something similar).

### Redux

Here's a quick example of [the state tree](./redux.json).

### Styles

The app uses Bootstrap and Bootswatch which are installed via npm. The main `less` file is included via `src/main.js` and imports all the styles for Bootstrap and the Bootswatch theme.

The styles are built with the Webpack loaders `style!css!postcss!less`. The style loader injects the CSS into the document while in development. These loaders are configured by [`hjs-webpack`](https://github.com/henrikjoreteg/hjs-webpack). In production, we use the `extract-text-webpack-plugin` to take the all the css and split it into a single bundle which gets saved to the build directory.

CSS modules are also setup in `webpack.config.js`, to look for any `.less` files located in the `src/` directory. Those are always imported directly to a component.

### Webpack + Building

`development` via `npm start`

This uses `webpack-dev-server` to serve the content from the `webpack.config.js` via [`hjs-webpack`](https://github.com/henrikjoreteg/hjs-webpack). It enables hot module reloading and a few other nice to haves.

`production` via `npm run build`

This builds the JS and CSS bundles and am html file via [`hjs-webpack`](https://github.com/henrikjoreteg/hjs-webpack) to the `build/` directory. It also copies any other assets required throughout the app via the `file-loader`.

### Deployment

Netlify.

Netlify is hooked up to the repo to process all pushes and build and host the site.

### Routing

The app uses `react-router`.

### React

**Pages** client/pages/

Pages are components that are called directly by the RouteHandler in `react-router`. We are only nesting a single level deep at the moment, so it makes sense to keep the all the top-level pages organized and everything else goes in `components/`.

**Bracket components** client/components/brackets/

These are the components that build a bracket. There is the bracket itself, the progess bar, the navigation for traversing the bracket history, and a bunch of other stuff.

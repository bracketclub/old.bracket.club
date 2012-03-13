# tweetyourbracket.com

## Quickstart

1. Install [`node`](http://nodejs.org/)
2. Install [`npm`](http://npmjs.org/)
3. `git clone git@github.com:lukekarrys/tweetyourbracket.com.git`
4. `cd tweetyourbracket.com`
5. `npm install`
6. `npm start`

## Notes

I never got Postgres working locally. It's currently using Postgres 8.1 shared DB in production on Heroku. Postgres is used to fill requests for `/user/username` but it currently only works in production for valid usernames and fails otherwise (bringing down the whole app).


## TODOs

- Make it not look like crap (using Bootstrap)
- Add some cooler interactions during the bracket (drag ‘n’ drop, keyboard shortcuts, auto scrolling)
- Mobile ready with some media queries
- Make the Postgres DB not break when a row doesn’t exist (sounds easy, so no idea why I couldn’t get it to work)
- Get Postgres working locally with a default schema and data
- Better hosting (for now it’s on a free Heroku instance)
- Make it actually do what was advertised and setup the Twitter Streaming API watcher
- Get server side scoring done to take a bracket and output the score and to add right/wrong colors to bracket display
- Add `/results` and `/rules`

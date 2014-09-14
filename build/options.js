var argv = require('./argv');


module.exports = {
    build: argv('build'),
    minify: argv('minify'),
    crawl: argv('crawl'),
    server: !argv('build') || argv('crawl'),
};

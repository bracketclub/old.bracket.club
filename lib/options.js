var argv = function (flag) {
    process.argv.join(' ').indexOf('--' + flag) > -1;
};


module.exports = {
    build: argv('build'),
    minify: argv('minify')
};

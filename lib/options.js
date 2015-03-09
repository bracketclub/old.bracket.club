var argv = function (flag) {
    return process.argv.join(' ').indexOf('--' + flag) > -1;
};


module.exports = {
    build: argv('build'),
    minify: argv('minify')
};

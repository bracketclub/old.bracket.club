module.exports = function (flag) {
    return process.argv.join(' ').indexOf('--' + flag) > -1;
};

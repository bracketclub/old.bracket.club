module.exports = function (arr) {
    arr = (' ' + arr).split(' ');
    return arr.join(' change:').slice(1);
};
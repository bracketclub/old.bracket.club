module.exports = function (txt) {
    return txt.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
};
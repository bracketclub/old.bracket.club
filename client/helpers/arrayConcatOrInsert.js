module.exports = function arrayConcatOrInsert (_arr, value, index) {
    let arr = _arr.slice(0);
    let lastIndex = arr.length - 1;

    if (typeof index === 'undefined') {
        index = lastIndex;
    }

    if (arr.length > 0 && index < lastIndex) {
        arr.splice(index + 1, arr.length);
    }

    if (arr[arr.length - 1] !== value) {
        arr.push(value);
        index = arr.length - 1;
    }

    return {arr, index};
};

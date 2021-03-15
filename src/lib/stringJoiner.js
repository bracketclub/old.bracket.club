const joiner = (arr, sep, last) =>
  arr.reduce((acc, item, index, items) => {
    if (index === items.length - 1) {
      acc += `${last || ''}${item}`
    } else {
      acc += `${item}${sep || ', '}`
    }
    return acc
  }, '')

export default joiner
export const or = (arr, sep) => joiner(arr, sep, 'or ')

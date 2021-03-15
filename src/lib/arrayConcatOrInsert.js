export default ({ values, index = values.length - 1 }, value) => {
  const arr = [...values]

  if (arr.length > 0 && index < arr.length - 1) {
    arr.splice(index + 1, arr.length)
  }

  if (arr[arr.length - 1] !== value) {
    arr.push(value)
  }

  return arr
}

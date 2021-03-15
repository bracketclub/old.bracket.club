export default (arr, val, key = 'id') => {
  if (!arr || !val) return null

  return Array.isArray(arr)
    ? arr.find((r) => r[key].toString() === val.toString())
    : arr[val] || null
}

export default (records, val, key = 'id') =>
  Array.isArray(records)
    ? records.find((r) => r[key].toString() === val.toString())
    : null;

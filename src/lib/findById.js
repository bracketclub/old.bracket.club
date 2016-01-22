export default (records, val, key = 'id') => {
  if (!records || !val) return null;

  return Array.isArray(records)
    ? records.find((r) => r[key].toString() === val.toString())
    : (records[val] || null);
};

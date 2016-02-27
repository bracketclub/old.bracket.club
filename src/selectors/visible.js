const getSlice = (slice, key) => (...args) => {
  const {records = {}, entities = {}} = slice(...args) || {};
  return {
    visibleSlice: records[key(...args)],
    entities
  };
};

const visible = (defaultValue) => (slice, key) => (...args) => {
  const {visibleSlice, entities} = getSlice(slice, key)(...args);

  if (!visibleSlice || !visibleSlice.result) return defaultValue;

  const {result} = visibleSlice;
  return Array.isArray(result) ? result.map((id) => entities[id]) : entities[result];
};

export const byId = visible({});
export const list = visible([]);

export const sync = (slice, key) => (...args) => {
  const {visibleSlice} = getSlice(slice, key)(...args);

  if (!visibleSlice) return {};

  const {syncing, refreshing, fetchError} = visibleSlice;
  return {syncing, refreshing, fetchError};
};

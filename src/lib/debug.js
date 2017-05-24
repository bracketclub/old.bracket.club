export default (store) => {
  const actions = ['users', 'masters', 'entries'].reduce((acc, type) => {
    acc[type] = {};
    const actionsFor = require(`../actions/${type}`);
    Object.keys(actionsFor).forEach((name) => {
      acc[type][name] = (...args) => store.dispatch(actionsFor[name](...args));
    });
    return acc;
  }, {});

  return {
    state: store.getState,
    dispatch: store.dispatch,
    ...actions
  };
};

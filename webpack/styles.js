const _ = require('lodash');

module.exports = (config, {src, isDev}) => {
  const removeLoaders = (removeExtensions) => {
    config.module.rules.forEach((rule, index, rules) => {
      const rm = removeExtensions.some((ext) => rule.test.source.endsWith(`.${ext}$`));
      if (rm) rules[index] = {};
    });
  };

  const addLoader = (rule, ruleOptions, loaderIndex, loaderOptions) => {
    const cloneRule = _.cloneDeep(rule);
    const loader = cloneRule.use[loaderIndex];
    _.assign(cloneRule, ruleOptions);
    cloneRule.use[loaderIndex] = {
      loader: loader.loader || loader,
      options: loaderOptions
    };
    config.module.rules.push(cloneRule);
  };

  // Save hjs less rule and then delete all style rules
  const lessRule = config.module.rules.find((rule) => rule.test.source.endsWith('.less$'));
  removeLoaders(['css', 'less']);

  // We know where the css loader is located, this is fragile but way easier than looking for it
  const cssIndex = isDev ? 1 : 2;

  addLoader(lessRule, {include: [src]}, cssIndex, {
    modules: true,
    minimize: isDev ? false : {discardComments: {removeAll: true}},
    localIdentName: `${isDev ? '[path][name]___[local]___' : ''}[hash:base64:5]`
  });

  addLoader(lessRule, {exclude: [src]}, cssIndex, {
    minimize: isDev ? false : {discardComments: {removeAll: true}}
  });

  // This is a modified object so be careful
  return config;
};

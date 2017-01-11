const path = require('path');
const babelJest = require('babel-jest');
const config = require('getconfig');

module.exports = {
  process: (src, filename, options, jestConfig) => {
    const relative = (file) => {
      const fromDir = path.dirname(filename);
      const toFile = path.join(options.rootDir, 'src', file);
      return `.${path.sep}${path.relative(fromDir, toFile)}`;
    };

    // Reimplement webpack :(
    src = src
      .replace(/from 'config'/g, `from '${relative('config/test')}'`)
      .replace(/from 'lib\/(.*)'/g, (__, arg) => `from '${relative(`lib/${arg}`)}'`)
      .replace(/__([A-Z]+)__/g, (__, arg) => JSON.stringify(config[arg.toLowerCase()]));

    return babelJest.process(src, filename, options, jestConfig);
  }
};

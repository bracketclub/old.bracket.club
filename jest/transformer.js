'use strict'

const path = require('path')
const babelJest = require('babel-jest')

module.exports = {
  process: (src, filename, options, jestConfig) => {
    const relative = (file) => {
      const fromDir = path.dirname(filename)
      const toFile = path.join(options.rootDir, 'src', file)
      return `.${path.sep}${path.relative(fromDir, toFile)}`
    }

    // Reimplement webpack :(
    src = src
      .replace(/from 'config'/g, `from '${relative('config/test')}'`)
      .replace(
        /from 'lib\/(.*)'/g,
        (__, arg) => `from '${relative(`lib/${arg}`)}'`
      )

    return babelJest.process(src, filename, options, jestConfig)
  },
}

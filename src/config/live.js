import base from './base'

export default {
  ...base,
  apiUrl: process.env.API_URL || 'https://bracketclub.herokuapp.com',
}

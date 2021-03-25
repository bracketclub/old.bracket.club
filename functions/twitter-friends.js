/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */

'use strict'

const Twit = require('twit')

const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } = process.env

const res = (body, statusCode = 200) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
})

exports.handler = async (event) => {
  const { queryStringParameters, httpMethod = '' } = event

  if (httpMethod !== 'GET') {
    return res({ error: `${httpMethod} not supported` }, 405)
  }

  if (queryStringParameters == null) {
    return res({ error: 'Missing one or more query string parameters' }, 400)
  }

  const { id, token, secret } = queryStringParameters

  if (!id || !token || !secret) {
    return res({ error: 'You must specify an id, token, and secret' }, 400)
  }

  if (!TWITTER_CONSUMER_KEY || !TWITTER_CONSUMER_SECRET) {
    return res(
      {
        error: 'Consumer key or consumer secret env variables are not set',
      },
      400
    )
  }

  try {
    const twit = new Twit({
      consumer_key: TWITTER_CONSUMER_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET,
      access_token: token,
      access_token_secret: secret,
    })
    const result = await twit.get('friends/ids', {
      user_id: id,
      stringify_ids: true,
    })
    return res({ ids: result.data.ids })
  } catch (err) {
    return res({ error: err.message }, 500)
  }
}

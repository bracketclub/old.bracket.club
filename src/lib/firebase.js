import { attempt, isError, get } from 'lodash'
import app from 'firebase/app'
import 'firebase/auth'

app.initializeApp({
  apiKey: 'AIzaSyDJLU-YvWJy12XQUlG6jOE3qgc5hZFFrHc',
  authDomain: 'tweetyourbracket.firebaseapp.com',
  databaseURL: 'https://tweetyourbracket.firebaseio.com',
  storageBucket: 'project-5935142175033376097.appspot.com',
})

export const auth = app.auth()
export const twitter = new app.auth.TwitterAuthProvider()

export const parseError = (fbError) => {
  const unkownError = 'An unknown error occurred'
  const code = get(fbError, 'code', '')
  const message = get(fbError, 'message', '')
  const error = attempt(() => JSON.parse(fbError.message))

  const errorMessage = isError(error)
    ? message || unkownError
    : get(error, 'error.message') || get(error, 'message') || unkownError

  return new Error(`${code ? `${code}: ` : ''}${errorMessage}`)
}

export default app

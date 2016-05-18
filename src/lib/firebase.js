import app from 'firebase/app';
import 'firebase/auth';

app.initializeApp({
  apiKey: 'AIzaSyDJLU-YvWJy12XQUlG6jOE3qgc5hZFFrHc',
  authDomain: 'tweetyourbracket.firebaseapp.com',
  databaseURL: 'https://tweetyourbracket.firebaseio.com',
  storageBucket: 'project-5935142175033376097.appspot.com'
});

export const auth = app.auth();
export const twitter = new app.auth.TwitterAuthProvider();

export default app;

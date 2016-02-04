import {Schema, arrayOf} from 'normalizr';

const users = new Schema('users');
const entries = new Schema('entries');
const masters = new Schema('masters');

entries.define({
  user: users
});

users.define({
  entries: arrayOf(entries)
});

export default {
  users,
  entries,
  masters
};

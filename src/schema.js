import {Schema, arrayOf} from 'normalizr';

const users = new Schema('users', {idAttribute: 'user_id'});
const entries = new Schema('entries', {idAttribute: 'data_id'});
const masters = new Schema('masters', {idAttribute: 'id'});

users.define({
  entries: arrayOf(entries)
});

entries.define({
  user: users
});

export default {
  users,
  entries,
  masters
};

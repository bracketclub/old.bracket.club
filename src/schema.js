import {Schema, arrayOf} from 'normalizr';

const users = new Schema('users', {idAttribute: 'user_id'});
const entries = new Schema('entries', {idAttribute: 'data_id'});
const masters = new Schema('masters', {idAttribute: 'id'});

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

import {Schema, arrayOf} from '@lukekarrys/normalizr';

const users = new Schema('users');
const entries = new Schema('entries');
const masters = new Schema('masters');

entries.define({
  user: users.mappedBy('entries')
});

users.define({
  entries: arrayOf(entries).mappedBy('user')
});

export default {
  users,
  entries,
  masters
};

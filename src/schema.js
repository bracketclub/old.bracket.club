import {schema} from 'normalizr';

const users = new schema.Entity('users', {}, {
  mergeStrategy: (a, b) => ({
    ...a,
    ...b,
    entries: [...a.entries, ...b.entries]
  }),
  processStrategy: (value, parent, key) => {
    switch (key) {
    case 'entries':
      return {...value, entries: [parent.id]};
    default:
      return {...value};
    }
  }
});

const entries = new schema.Entity('entries', {user: users});

const masters = new schema.Entity('masters');

export {users as users};
export {entries as entries};
export {masters as masters};

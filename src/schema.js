import {schema} from 'normalizr';

// They schema keys are used as keys in the redux store and to generate action
// names, so thats why those are always the pluralized versions

const master = new schema.Entity('masters');
const entry = new schema.Entity('entries');

const user = new schema.Entity('users', {entries: [entry]}, {
  processStrategy: (value, parent, key) => {
    switch (key) {
    case 'user':
      return {...value, entries: [parent.id]};
    default:
      return {...value};
    }
  }
});

// Users and entries have a circular relationship, so we have to define one
// of those after creating the schemas. A user has many entries and an entry
// has one user
entry.define({user});

export {user as user};
export {entry as entry};
export {master as master};

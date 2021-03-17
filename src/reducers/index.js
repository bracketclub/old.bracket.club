import { combineReducers } from 'redux'
import endpoint from 'lib/endpointReducer'
import * as schema from '../schema'
import me from './me'
import event from './event'
import entry from './entry'
import canWin from './canWin'
import sse from './sse'

export default combineReducers({
  me,
  event,
  entry,
  canWin,
  sse,
  users: endpoint(schema.user),
  masters: endpoint(schema.master),
  entries: endpoint(schema.entry),
})

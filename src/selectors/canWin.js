import { createSelector } from 'reselect'
import { id } from './event'
import { index } from './masters'

const canWin = (state) => state.canWin

export const canWinGlobal = createSelector(
  canWin,
  id,
  index,
  ($canWin, $id, $index) => $canWin[`${$id}-${$index}-global`] || {}
)

export const canWinFriends = createSelector(
  canWin,
  id,
  index,
  ($canWin, $id, $index) => $canWin[`${$id}-${$index}-friends`] || {}
)

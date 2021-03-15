/* eslint-env worker */

import BracketPossibilities from 'bracket-possibilities'

onmessage = ({ data }) => {
  const { sport, year, entries, master, id } = data

  if (!sport || !year) return

  const p = new BracketPossibilities({ sport, year })

  postMessage(
    p.canWin({
      entries,
      master,
      findEntry: (f) => f.id === id,
    })
  )
}

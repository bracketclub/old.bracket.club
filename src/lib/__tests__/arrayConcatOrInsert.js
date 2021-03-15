/* eslint-env jest */
/* eslint no-magic-numbers:0 */

import arrayConcatOrInsert from '../arrayConcatOrInsert'

it('Adds to end of array', () => {
  const start = [0, 1, 2, 3, 4, 5, 6]
  const arr = arrayConcatOrInsert({ values: start }, 7)
  const index = arr.length - 1

  expect(start.length).toBe(7)
  expect(start[6]).toBe(6)

  expect(arr.length).toBe(8)
  expect(arr[7]).toBe(7)
  expect(arr.join('')).toBe('01234567')
  expect(index).toBe(7)
})

it('Adds to middle of array', () => {
  const start = [0, 1, 2, 3, 4, 5, 6]
  const arr = arrayConcatOrInsert({ values: start, index: 4 }, 7)
  const index = arr.length - 1

  expect(start.length).toBe(7)
  expect(start[6]).toBe(6)

  expect(arr.length).toBe(6)
  expect(arr[5]).toBe(7)
  expect(arr.join('')).toBe('012347')

  expect(index).toBe(5)
})

it('Adds to beginning of array', () => {
  const start = [0, 1, 2, 3, 4, 5, 6]
  const arr = arrayConcatOrInsert({ values: start, index: 0 }, 7)
  const index = arr.length - 1

  expect(start.length).toBe(7)
  expect(start[6]).toBe(6)

  expect(arr.length).toBe(2)
  expect(arr[1]).toBe(7)
  expect(arr.join('')).toBe('07')

  expect(index).toBe(1)
})

it('Wont double up value at end of array', () => {
  const start = [0, 1, 2, 3, 4, 5, 6]
  const arr = arrayConcatOrInsert({ values: start }, 6)
  const index = arr.length - 1

  expect(start.length).toBe(7)
  expect(start[6]).toBe(6)

  expect(arr.length).toBe(7)
  expect(arr[6]).toBe(6)
  expect(arr.join('')).toBe('0123456')

  expect(index).toBe(6)
})

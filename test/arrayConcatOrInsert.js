/* eslint no-magic-numbers:0 */

import test from 'tape';
import arrayConcatOrInsert from '../src/lib/arrayConcatOrInsert';

test('Adds to end of array', (t) => {
  const start = [0, 1, 2, 3, 4, 5, 6];
  const arr = arrayConcatOrInsert({values: start}, 7);
  const index = arr.length - 1;

  t.equal(start.length, 7);
  t.equal(start[6], 6);

  t.equal(arr.length, 8);
  t.equal(arr[7], 7);
  t.equal(arr.join(''), '01234567');
  t.equal(index, 7);

  t.end();
});

test('Adds to middle of array', (t) => {
  const start = [0, 1, 2, 3, 4, 5, 6];
  const arr = arrayConcatOrInsert({values: start, index: 4}, 7);
  const index = arr.length - 1;

  t.equal(start.length, 7);
  t.equal(start[6], 6);

  t.equal(arr.length, 6);
  t.equal(arr[5], 7);
  t.equal(arr.join(''), '012347');

  t.equal(index, 5);

  t.end();
});

test('Adds to beginning of array', (t) => {
  const start = [0, 1, 2, 3, 4, 5, 6];
  const arr = arrayConcatOrInsert({values: start, index: 0}, 7);
  const index = arr.length - 1;

  t.equal(start.length, 7);
  t.equal(start[6], 6);

  t.equal(arr.length, 2);
  t.equal(arr[1], 7);
  t.equal(arr.join(''), '07');

  t.equal(index, 1);

  t.end();
});

test('Wont double up value at end of array', (t) => {
  const start = [0, 1, 2, 3, 4, 5, 6];
  const arr = arrayConcatOrInsert({values: start}, 6);
  const index = arr.length - 1;

  t.equal(start.length, 7);
  t.equal(start[6], 6);

  t.equal(arr.length, 7);
  t.equal(arr[6], 6);
  t.equal(arr.join(''), '0123456');

  t.equal(index, 6);

  t.end();
});

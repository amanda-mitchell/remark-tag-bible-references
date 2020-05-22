const { awaitValues } = require('../util');

function delayedValue(value) {
  return new Promise(resolve => setImmediate(() => resolve(value)));
}

test('it waits for all the promises to resolve', async () => {
  const promises = {
    a: delayedValue('a'),
    b: delayedValue('b'),
  };

  expect(await awaitValues(promises)).toMatchObject({ a: 'a', b: 'b' });
});

test('it allows mixed content', async () => {
  const promises = {
    a: delayedValue('a'),
    b: 'b',
  };

  expect(await awaitValues(promises)).toMatchObject({ a: 'a', b: 'b' });
});

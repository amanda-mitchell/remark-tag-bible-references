const build = require('unist-builder');
const { isText, isLink } = require('../predicates');

describe('isText', () => {
  test('it returns true for a text node', () => {
    expect(isText(build('text', 'hi'))).toEqual(true);
  });

  test('it returns false for something else', () => {
    expect(isText(build('somethingElse', 'hi'))).toEqual(false);
  });
});

describe('isLink', () => {
  test('it returns true for a link node', () => {
    expect(isLink(build('link', [build('text', 'hi')]))).toEqual(true);
  });

  test('it returns true for a linkReference node', () => {
    expect(isLink(build('linkReference', [build('text', 'hi')]))).toEqual(true);
  });

  test('it returns false for something else', () => {
    expect(isLink(build('somethingElse', 'hi'))).toEqual(false);
  });
});

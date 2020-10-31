const build = require('unist-builder');
const { isText, isLink } = require('../predicates');

describe('isText', () => {
  test('it returns true for a text node', () => {
    expect(isText(build('text', 'hi'))).toBeTruthy();
  });

  test('it returns false for something else', () => {
    expect(isText(build('somethingElse', 'hi'))).toBeFalsy();
  });
});

describe('isLink', () => {
  test('it returns true for a link node', () => {
    expect(isLink(build('link', [build('text', 'hi')]))).toBeTruthy();
  });

  test('it returns true for a linkReference node', () => {
    expect(isLink(build('linkReference', [build('text', 'hi')]))).toBeTruthy();
  });

  test('it returns false for something else', () => {
    expect(isLink(build('somethingElse', 'hi'))).toBeFalsy();
  });
});

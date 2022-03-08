import { u as build } from 'unist-builder';
import { scanTextNodes } from '../scan.js';

test('it scans a text node', async () => {
  const bibliaApi = {
    async scan() {
      return {
        results: [{ passage: 'Genesis 1:1', textIndex: 0, textLength: 1 }],
      };
    },
    async parse() {
      return {
        passages: [{ parts: { book: 'Genesis', chapter: 1, verse: 1 } }],
      };
    },
  };

  const result = await scanTextNodes(
    build('text', 'Hello, world!'),
    bibliaApi,
    { tagChapters: true }
  );

  expect(result).toEqual({
    'Hello, world!': [
      {
        parts: { book: 'Genesis', chapter: 1, verse: 1 },
        passage: 'Genesis 1:1',
        textIndex: 0,
        textLength: 1,
      },
    ],
  });
});

const trees = [
  {
    name: 'Find text in a paragraph',
    tree: build('paragraph', [build('text', 'Hello, world!')]),
    expectedValues: ['Hello, world!'],
  },
  {
    name: 'Find text in a list item',
    tree: build('list', [
      build('listItem', [build('paragraph', [build('text', 'Hello, world!')])]),
    ]),
    expectedValues: ['Hello, world!'],
  },
  {
    name: 'Find text in multiple paragraphs',
    tree: build('root', [
      build('paragraph', [build('text', 'Hello, world!')]),
      build('paragraph', [build('text', 'More text')]),
    ]),
    expectedValues: ['Hello, world!', 'More text'],
  },
  {
    name: 'Dedupe content',
    tree: build('root', [
      build('paragraph', [build('text', 'Hello, world!')]),
      build('paragraph', [build('text', 'Hello, world!')]),
    ]),
    expectedValues: ['Hello, world!'],
  },
  {
    name: 'Skips links',
    tree: build('paragraph', [
      build('link', [build('text', 'Hello, world!')]),
      build('linkReference', [build('text', 'Hello, world!')]),
    ]),
    expectedValues: [],
  },
];

describe.each(trees)('find text nodes', ({ name, tree, expectedValues }) => {
  test(name, async () => {
    const textValues = [];
    const bibliaApi = {
      scan({ text }) {
        textValues.push(text);
        return { results: [] };
      },
    };

    await scanTextNodes(tree, bibliaApi, { tagChapters: true });

    expect(textValues).toEqual(expectedValues);
  });
});

describe.each([true, false])('pass through tagChapters values', value => {
  test('it respects a tagChapters value of ' + value, async () => {
    let tagValues = [];
    const bibliaApi = {
      scan({ tagChapters }) {
        tagValues.push(tagChapters);
        return { results: [] };
      },
    };

    await scanTextNodes(build('text', 'Hello, world!'), bibliaApi, {
      tagChapters: value,
    });

    expect(tagValues).toEqual([value]);
  });
});

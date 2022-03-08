import { u as build } from 'unist-builder';
import { applyScanResults } from '../apply.js';

const trees = [
  {
    name: 'Find text in a paragraph',
    tree: build('paragraph', [build('text', 'Hello, world!')]),
    scanResults: {
      'Hello, world!': [
        {
          textIndex: 0,
          textLength: 5,
          passage: 'passage',
          parts: { book: 'book' },
        },
      ],
    },
    expectedResult: build('paragraph', [
      build(
        'link',
        {
          url: 'https://biblia.com/bible/book',
          data: {
            bibleReference: { passage: 'passage', parts: { book: 'book' } },
          },
        },
        [build('text', 'Hello')]
      ),
      build('text', ', world!'),
    ]),
  },
  {
    name: 'Find text in a list item',
    tree: build('list', [
      build('listItem', [build('paragraph', [build('text', 'Hello, world!')])]),
    ]),
    scanResults: {
      'Hello, world!': [
        {
          textIndex: 0,
          textLength: 5,
          passage: 'passage',
          parts: { book: 'book' },
        },
      ],
    },
    expectedResult: build('list', [
      build('listItem', [
        build('paragraph', [
          build(
            'link',
            {
              url: 'https://biblia.com/bible/book',
              data: {
                bibleReference: { passage: 'passage', parts: { book: 'book' } },
              },
            },
            [build('text', 'Hello')]
          ),
          build('text', ', world!'),
        ]),
      ]),
    ]),
  },
  {
    name: 'Find text in multiple paragraphs',
    tree: build('root', [
      build('paragraph', [build('text', 'Hello, world!')]),
      build('paragraph', [build('text', 'More text')]),
    ]),
    scanResults: {
      'Hello, world!': [
        {
          textIndex: 0,
          textLength: 5,
          passage: 'passage',
          parts: { book: 'book' },
        },
      ],
      'More text': [
        {
          textIndex: 5,
          textLength: 4,
          passage: 'other passage',
          parts: { book: 'other book' },
        },
      ],
    },
    expectedResult: build('root', [
      build('paragraph', [
        build(
          'link',
          {
            url: 'https://biblia.com/bible/book',
            data: {
              bibleReference: { passage: 'passage', parts: { book: 'book' } },
            },
          },
          [build('text', 'Hello')]
        ),
        build('text', ', world!'),
      ]),
      build('paragraph', [
        build('text', 'More '),
        build(
          'link',
          {
            url: 'https://biblia.com/bible/other-book',
            data: {
              bibleReference: {
                passage: 'other passage',
                parts: { book: 'other book' },
              },
            },
          },
          [build('text', 'text')]
        ),
      ]),
    ]),
  },
  {
    name: 'Tag duplicate content',
    tree: build('root', [
      build('paragraph', [build('text', 'Hello, world!')]),
      build('paragraph', [build('text', 'Hello, world!')]),
    ]),
    scanResults: {
      'Hello, world!': [
        {
          textIndex: 0,
          textLength: 5,
          passage: 'passage',
          parts: { book: 'book' },
        },
      ],
    },
    expectedResult: build('root', [
      build('paragraph', [
        build(
          'link',
          {
            url: 'https://biblia.com/bible/book',
            data: {
              bibleReference: { passage: 'passage', parts: { book: 'book' } },
            },
          },
          [build('text', 'Hello')]
        ),
        build('text', ', world!'),
      ]),
      build('paragraph', [
        build(
          'link',
          {
            url: 'https://biblia.com/bible/book',
            data: {
              bibleReference: { passage: 'passage', parts: { book: 'book' } },
            },
          },
          [build('text', 'Hello')]
        ),
        build('text', ', world!'),
      ]),
    ]),
  },
  {
    name: 'Skips links',
    tree: build('paragraph', [
      build('link', [build('text', 'Hello, world!')]),
      build('linkReference', [build('text', 'Hello, world!')]),
    ]),
    scanResults: {
      'Hello, world!': [
        {
          textIndex: 0,
          textLength: 5,
          passage: 'passage',
          parts: { book: 'book' },
        },
      ],
    },
    expectedResult: build('paragraph', [
      build('link', [build('text', 'Hello, world!')]),
      build('linkReference', [build('text', 'Hello, world!')]),
    ]),
  },
];

describe.each(trees)(
  'split text nodes',
  ({ name, tree, scanResults, expectedResult }) => {
    test(name, async () => {
      const result = await applyScanResults(tree, scanResults);

      expect(result).toEqual(expectedResult);
    });
  }
);

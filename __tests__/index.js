require('dotenv').config();
const fetch = require('node-fetch');
const unified = require('unified');
const markdown = require('remark-parse');
const build = require('unist-builder');
const { createBibliaApiClient } = require('@amanda-mitchell/biblia-api');
const { tagBibleReferences } = require('..');

function createProcessor(bibliaApi) {
  function nullCompiler() {
    this.Compiler = tree => tree;
  }

  return unified()
    .use(markdown)
    .use(tagBibleReferences, {
      bibliaApi,
    })
    .use(nullCompiler)
    .freeze();
}

describe('integration tests', () => {
  beforeAll(() => {
    expect(process.env['BIBLIA_API_KEY']).toBeDefined();
  });

  test('it parses correctly', async () => {
    const doc = `
# Hello, world!
	
One of my favorite passages is Prov 26:4-5.
I am going to place a verse reference like Genesis
2:1 across a line break.
	
Genesis 2:1, 3-4
`;

    const bibliaApi = createBibliaApiClient({
      apiKey: process.env['BIBLIA_API_KEY'],
      fetch,
    });
    const processor = createProcessor(bibliaApi);

    const { result } = await processor.process(doc);

    expect(result).toMatchObject(
      build('root', [
        build('heading', { depth: 1 }, [build('text', 'Hello, world!')]),
        build('paragraph', [
          build('text', 'One of my favorite passages is '),
          build(
            'link',
            {
              data: {
                bibleReference: {
                  passage: 'Proverbs 26:4\u20135',
                  parts: {
                    book: 'Proverbs',
                    chapter: 26,
                    verse: 4,
                    endVerse: 5,
                  },
                },
              },
              url: 'https://biblia.com/bible/proverbs/26/4-5',
            },
            [build('text', 'Prov 26:4-5')]
          ),
          build('text', '.\nI am going to place a verse reference like '),
          build(
            'link',
            {
              data: {
                bibleReference: {
                  passage: 'Genesis 2:1',
                  parts: { book: 'Genesis', chapter: 2, verse: 1 },
                },
              },
              url: 'https://biblia.com/bible/genesis/2/1',
            },
            [build('text', 'Genesis\n2:1')]
          ),
          build('text', ' across a line break.'),
        ]),
        build('paragraph', [
          build(
            'link',
            {
              data: {
                bibleReference: {
                  passage: 'Genesis 2:1',
                  parts: { book: 'Genesis', chapter: 2, verse: 1 },
                },
              },
              url: 'https://biblia.com/bible/genesis/2/1',
            },
            [build('text', 'Genesis 2:1')]
          ),
          build('text', ', '),
          build(
            'link',
            {
              data: {
                bibleReference: {
                  passage: 'Genesis 2:3\u20134',
                  parts: {
                    book: 'Genesis',
                    chapter: 2,
                    verse: 3,
                    endVerse: 4,
                  },
                },
              },
              url: 'https://biblia.com/bible/genesis/2/3-4',
            },
            [build('text', '3-4')]
          ),
        ]),
      ])
    );
  });
});

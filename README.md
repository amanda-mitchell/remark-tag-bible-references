# @amanda-mitchell/remark-tag-bible-references

This is a remark plugin that will use the Biblia API to tag Bible references.

## Installation

```
yarn add @amanda-mitchell/biblia-api @amanda-mitchell/remark-tag-bible-references
```

## Usage

```js
import { unified } from 'unified';
import markdown from 'remark-parse';
import stringify from 'rehype-stringify';
import remark2rehype from 'remark-rehype';
import fetch from 'node-fetch'; // This can be any library that implements the Fetch interface
import { createBibliaApiClient } from '@amanda-mitchell/biblia-api';
import { tagBibleReferences } from '@amanda-mitchell/remark-tag-bible-references';

const apiKey =
  'Go to https://bibliaapi.com/docs/API_Keys to generate an API key.';

const bibliaApi = createBibliaApiClient({ apiKey, fetch });

const markdownDoc = `
# Hello, world!
	
One of my favorite passages is Prov 26:4-5.
`;

const html = unified()
  .use(markdown)
  .use(tagBibleReferences, { bibliaApi })
  .use(remark2rehype)
  .use(stringify)
  .process(markdownDoc).contents;

console.log(html);
```

When run, this script will print

<!-- prettier-ignore -->
```html
<h1>Hello, world!</h1>
<p>One of my favorite passages is <a href="https://biblia.com/bible/proverbs/26/4-5">Prov 26:4-5</a>.</p>
```

In addition to transforming Bible references into links, this plugin will also attach a `bibleReference` property to each link's `data` node that contains information about the parsed reference.

import { awaitValues } from './util.js';
import { isLink, isText } from './predicates.js';

export async function scanTextNodes(tree, bibliaApi, { tagChapters }) {
  const scanResults = await mapUniqueValues(
    findLinkableTextNodeValues(tree),
    text => scanForReferences(bibliaApi, text, tagChapters)
  );

  const resultValues = Object.values(scanResults).flat();

  const parseResults = await mapUniqueValues(
    resultValues.map(({ passage }) => passage),
    passage => getPassageParts(bibliaApi, passage)
  );

  for (const resultValue of resultValues) {
    resultValue.parts = parseResults[resultValue.passage];
  }

  return scanResults;
}

async function mapUniqueValues(values, fn) {
  const uniqueValues = [...new Set(values)];

  return await awaitValues(
    Object.assign(
      {},
      ...uniqueValues.map(value => ({
        [value]: fn(value),
      }))
    )
  );
}

async function getPassageParts(bibliaApi, passage) {
  const { passages } = await bibliaApi.parse({ passage, style: 'short' });

  return passages[0].parts;
}

async function scanForReferences(bibliaApi, text, tagChapters) {
  const { results } = await bibliaApi.scan({ text, tagChapters });

  return results;
}

// In this context, "linkable" means that the text node
// is the child of an element that accepts links in its children.
function findLinkableTextNodeValues(node) {
  if (isLink(node)) {
    return [];
  }

  if (isText(node)) {
    return [node.value];
  }

  if (node.children) {
    return node.children.flatMap(findLinkableTextNodeValues);
  }

  return [];
}

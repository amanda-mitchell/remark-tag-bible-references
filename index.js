import { scanTextNodes } from './scan.js';
import { applyScanResults } from './apply.js';

export function tagBibleReferences({ bibliaApi, tagChapters }) {
  const scanOptions = { tagChapters };

  return async function transform(tree) {
    const scanResults = await scanTextNodes(tree, bibliaApi, scanOptions);

    return applyScanResults(tree, scanResults);
  };
}

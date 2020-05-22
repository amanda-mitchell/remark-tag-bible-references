const { scanTextNodes } = require('./scan');
const { applyScanResults } = require('./apply');

function tagBibleReferences({ bibliaApi, tagChapters }) {
  const scanOptions = { tagChapters };

  return async function transform(tree) {
    const scanResults = await scanTextNodes(tree, bibliaApi, scanOptions);

    return applyScanResults(tree, scanResults);
  };
}

module.exports.tagBibleReferences = tagBibleReferences;

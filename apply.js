import { u as build } from 'unist-builder';
import { isLink, isText } from './predicates.js';
import { createBibliaLink } from './links.js';

export function applyScanResults(node, scanResults) {
  if (isLink(node)) {
    return node;
  }

  if (!node.children) {
    return node;
  }

  return {
    ...node,
    children: node.children.flatMap(child => splitNode(child, scanResults)),
  };
}

function splitNode(node, scanResults) {
  if (!isText(node)) {
    return applyScanResults(node, scanResults);
  }

  const childText = node.value;
  const scanResult = scanResults[childText];

  if (!scanResult || scanResult.length === 0) {
    return node;
  }

  return [...createNodesForScanResult(childText, scanResult)];
}

function* createNodesForScanResult(text, scanResult) {
  let lastEndIndex = 0;

  for (const { passage, parts, textIndex, textLength } of scanResult) {
    if (lastEndIndex < textIndex) {
      yield build('text', text.substr(lastEndIndex, textIndex - lastEndIndex));
    }

    yield build(
      'link',
      {
        url: createBibliaLink(parts),
        data: {
          bibleReference: { parts, passage },
        },
      },
      [build('text', text.substr(textIndex, textLength))]
    );

    lastEndIndex = textIndex + textLength;
  }

  if (lastEndIndex < text.length) {
    yield build('text', text.substr(lastEndIndex));
  }
}

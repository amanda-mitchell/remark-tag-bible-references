import is from 'unist-util-is';

export const isLink = is.convert(['link', 'linkReference']);
export const isText = is.convert('text');

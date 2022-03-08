import { convert } from 'unist-util-is';

export const isLink = convert(['link', 'linkReference']);
export const isText = convert('text');

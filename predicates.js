const is = require('unist-util-is');

module.exports.isLink = is.convert(['link', 'linkReference']);
module.exports.isText = is.convert('text');

module.exports.awaitValues = async function awaitValues(hash) {
  const entries = await Promise.all(
    Object.entries(hash).map(async ([key, value]) => ({ [key]: await value }))
  );

  return Object.assign({}, ...entries);
};

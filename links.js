const bibliaPrefix = 'https://biblia.com/bible/';

export function createBibliaLink({
  book,
  endBook,
  chapter,
  endChapter,
  verse,
  endVerse,
}) {
  if (endBook || endChapter) {
    return `${bibliaPrefix}${formatPassage({
      book,
      chapter,
      verse,
    })}--${formatPassage({
      book: endBook,
      chapter: endChapter,
      verse: endVerse,
    })}`;
  }

  let result = bibliaPrefix + formatPassage({ book, chapter, verse }, '/');
  if (endVerse) {
    result += `-${endVerse}`;
  }

  return result;
}

function formatPassage({ book, chapter, verse }, separator = '-') {
  const components = [];
  if (book) {
    components.push(formatBookName(book));
  }
  if (chapter) {
    components.push(chapter);
  }
  if (verse) {
    components.push(verse);
  }

  return components.join(separator);
}

function formatBookName(book) {
  return book.toLowerCase().replace(' ', '-');
}

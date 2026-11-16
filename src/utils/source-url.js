// Keep NB source identity stable across encoded aliases of a frozen textbook chapter.
export function sourceUrl(includeViewerQuery = true) {
  const published = document.documentElement.hasAttribute('data-nb-textbook')
    ? document.documentElement.getAttribute('data-nb-source-path') : null
  if (published && published.startsWith('/books/social_psychology/') && !published.includes('..')) {
    return window.location.origin + published
  }
  if (includeViewerQuery && window.location.pathname === '/nb_viewer.html') return window.location.href
  return window.location.origin + window.location.pathname
}

export function bookReaderActive() {
  return document.documentElement.hasAttribute('data-nb-textbook') &&
    (document.documentElement.dataset.ttsReader === 'on' || document.documentElement.dataset.nbReaderRestoring === 'true')
}

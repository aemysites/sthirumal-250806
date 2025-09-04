/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all card elements in the block
  // Defensive: Only select direct children of the gridlayout > .row > .col* > ...
  const cardRows = [];
  const headerRow = ['Cards (cards15)'];

  // Find all columns in the grid
  const columns = element.querySelectorAll(':scope > .row > div');
  columns.forEach((col) => {
    // Each column may have nested wrappers, so look for .lp__card inside
    const card = col.querySelector('.lp__card');
    if (card) {
      // Image: find the <img> inside .lp__card_img
      const imgWrapper = card.querySelector('.lp__card_img');
      let imgEl = null;
      if (imgWrapper) {
        imgEl = imgWrapper.querySelector('img');
      }
      // Text: find the .lp__card_content
      const contentWrapper = card.querySelector('.lp__card_content');
      let textContent = null;
      if (contentWrapper) {
        // We'll include the whole contentWrapper (contains h3, description, etc)
        textContent = contentWrapper;
      }
      // Only add if both image and text are present
      if (imgEl && textContent) {
        cardRows.push([imgEl, textContent]);
      }
    }
  });

  // Only build the table if we have at least one card
  if (cardRows.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ...cardRows
    ], document);
    element.replaceWith(table);
  }
}

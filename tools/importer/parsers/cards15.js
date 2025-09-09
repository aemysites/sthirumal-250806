/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card data from a column
  function extractCard(col) {
    // Defensive: find the card wrapper
    const card = col.querySelector('.lp__card_wrapper');
    if (!card) return null;

    // Image: find the <img> inside .lp__card_img
    let imgCell = null;
    const imgWrap = card.querySelector('.lp__card_img');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img) imgCell = img;
    }

    // Text: title, description, CTA
    const contentWrap = card.querySelector('.lp__card_content');
    let textCellItems = [];
    if (contentWrap) {
      // Title
      const title = contentWrap.querySelector('.lp__card_title');
      if (title) textCellItems.push(title);
      // Description
      const desc = contentWrap.querySelector('.lp__card_description');
      if (desc) textCellItems.push(desc);
    }
    // CTA: overlay link (not the title link)
    const overlayLink = card.querySelector('.lp__overlay-link');
    if (overlayLink) {
      // Only add if href is present and not duplicate of title link
      // (title link is inside h3)
      const titleLink = contentWrap && contentWrap.querySelector('a');
      if (!titleLink || titleLink.href !== overlayLink.href) {
        textCellItems.push(overlayLink);
      }
    }

    // Defensive: if nothing found, skip
    if (!imgCell && textCellItems.length === 0) return null;
    return [imgCell || '', textCellItems.length > 1 ? textCellItems : textCellItems[0] || ''];
  }

  // Find all columns with cards
  const cols = Array.from(element.querySelectorAll(':scope > .row > .colsplit'));
  const rows = [];
  for (const col of cols) {
    const cardRow = extractCard(col);
    if (cardRow) rows.push(cardRow);
  }

  // Only build table if we have at least one card
  if (rows.length === 0) return;

  // Table header
  const headerRow = ['Cards (cards15)'];
  const cells = [headerRow, ...rows];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

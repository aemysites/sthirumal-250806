/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find all card columns
  const cardColumns = Array.from(element.querySelectorAll(':scope > div.row > div.colsplit'));
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards35)'];
  rows.push(headerRow);
  // For each card column
  cardColumns.forEach((col) => {
    // Defensive: find the card wrapper
    const cardWrapper = col.querySelector('.lp__card_wrapper');
    if (!cardWrapper) return;
    // Image cell: find the picture or img
    let imgCell = null;
    const imgDiv = cardWrapper.querySelector('.lp__card_img');
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imgCell = picture;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) imgCell = img;
      }
    }
    // Text cell: title, description, CTA
    const contentDiv = cardWrapper.querySelector('.lp__card_content');
    const textCellContent = [];
    if (contentDiv) {
      // Title
      const title = contentDiv.querySelector('.lp__card_title');
      if (title) textCellContent.push(title);
      // Description
      const desc = contentDiv.querySelector('.lp__card_description');
      if (desc) textCellContent.push(desc);
    }
    // CTA: overlay link (not the title link)
    const overlayLink = cardWrapper.querySelector('.lp__overlay-link');
    if (overlayLink) {
      // Only add if href is present and not duplicate of title link
      const titleLink = contentDiv && contentDiv.querySelector('.lp__card_title a');
      if (!titleLink || (titleLink.href !== overlayLink.href)) {
        textCellContent.push(overlayLink);
      }
    }
    // Defensive: if no image, fallback to empty string
    if (!imgCell) imgCell = '';
    // Defensive: if no text content, fallback to empty string
    const textCell = textCellContent.length ? textCellContent : [''];
    rows.push([imgCell, textCell]);
  });
  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace element
  element.replaceWith(block);
}

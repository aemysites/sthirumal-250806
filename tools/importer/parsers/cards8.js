/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate card columns
  const cardColumns = Array.from(element.querySelectorAll(':scope > .row > .colsplit'));
  const rows = [];

  // Always start with the block header
  const headerRow = ['Cards (cards8)'];
  rows.push(headerRow);

  cardColumns.forEach((col) => {
    // Defensive: find the card wrapper
    const card = col.querySelector('.lp__card_wrapper');
    if (!card) return;

    // Image cell: find the <picture> or <img>
    let imageCell = null;
    const imgContainer = card.querySelector('.lp__card_img');
    if (imgContainer) {
      // Use the <picture> element if present, else <img>
      const picture = imgContainer.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imgContainer.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Text cell: title, description, CTA
    const contentContainer = card.querySelector('.lp__card_content');
    const textCellContent = [];
    if (contentContainer) {
      // Title (as heading)
      const title = contentContainer.querySelector('.lp__card_title');
      if (title) textCellContent.push(title);
      // Description
      const desc = contentContainer.querySelector('.lp__card_description');
      if (desc) textCellContent.push(desc);
    }
    // CTA: overlay link (not the title link)
    const overlayLink = card.querySelector('.lp__overlay-link');
    if (overlayLink) {
      // Only add if it's not the same as the title link
      textCellContent.push(overlayLink);
    }

    // Defensive: if no image or text, skip
    if (!imageCell && textCellContent.length === 0) return;
    rows.push([imageCell, textCellContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

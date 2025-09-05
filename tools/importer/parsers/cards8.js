/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate card columns
  const cardColumns = Array.from(element.querySelectorAll(':scope > .row > .colsplit'));

  const rows = [];
  // Always start with the block header
  rows.push(['Cards (cards8)']);

  cardColumns.forEach((col) => {
    // Defensive: find the card wrapper
    const card = col.querySelector('.lp__card_wrapper');
    if (!card) return;

    // Image: get the <picture> or <img> inside .lp__card_img
    let imgCell = null;
    const imgWrap = card.querySelector('.lp__card_img');
    if (imgWrap) {
      // Prefer <picture> if present, else <img>
      const picture = imgWrap.querySelector('picture');
      if (picture) {
        imgCell = picture;
      } else {
        const img = imgWrap.querySelector('img');
        if (img) imgCell = img;
      }
    }

    // Text cell: title, description, CTA
    const contentWrap = card.querySelector('.lp__card_content');
    const textCellContent = [];
    if (contentWrap) {
      // Title (h3 > a)
      const title = contentWrap.querySelector('.lp__card_title');
      if (title) textCellContent.push(title);
      // Description
      const desc = contentWrap.querySelector('.lp__card_description');
      if (desc) textCellContent.push(desc);
    }
    // CTA: overlay link (outside contentWrap)
    const ctaLink = card.querySelector('.lp__overlay-link');
    if (ctaLink) textCellContent.push(ctaLink);

    // Defensive: only add row if image and text
    if (imgCell && textCellContent.length) {
      rows.push([imgCell, textCellContent]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}

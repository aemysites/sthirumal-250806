/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all direct card children
  const cards = Array.from(element.querySelectorAll(':scope > .lp-sticky-card'));
  const rows = [];
  // Header row as required
  rows.push(['Cards (cards21)']);

  cards.forEach(card => {
    // Image cell: find the <img> inside .lp-sticky-card-img
    const imgWrap = card.querySelector('.lp-sticky-card-img');
    let imageEl = null;
    if (imgWrap) {
      // Use the <picture> element if present, otherwise <img>
      const picture = imgWrap.querySelector('picture');
      if (picture) {
        imageEl = picture;
      } else {
        const img = imgWrap.querySelector('img');
        if (img) imageEl = img;
      }
    }

    // Text cell: use the .lp-sticky-card-content block
    const content = card.querySelector('.lp-sticky-card-content');
    let textCell;
    if (content) {
      // Use heading and paragraph if present
      const heading = content.querySelector('h3');
      const para = content.querySelector('p');
      const cellContent = [];
      if (heading) cellContent.push(heading);
      if (para) cellContent.push(para);
      textCell = cellContent;
    } else {
      textCell = '';
    }

    rows.push([
      imageEl || '',
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

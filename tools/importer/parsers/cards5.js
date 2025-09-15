/* global WebImporter */
export default function parse(element, { document }) {
  // Find the FIRST .gridlayout with .row and .lp__card_wrapper (the main card grid)
  const grid = element.querySelector('.gridlayout .row .lp__card_wrapper')
    ? element.querySelector('.gridlayout')
    : null;

  if (!grid) return;

  // Get all columns (each card)
  const columns = grid.querySelectorAll(':scope .row > [class*=colsplit]');
  const cardRows = [];

  columns.forEach((col) => {
    const cardWrapper = col.querySelector('.lp__card_wrapper');
    if (!cardWrapper) return;
    // Image: prefer <picture>, fallback to <img>
    let image = cardWrapper.querySelector('.lp__card_img picture');
    if (!image) {
      image = cardWrapper.querySelector('.lp__card_img img');
    }
    if (image) image = image.cloneNode(true);

    // Text content
    const content = cardWrapper.querySelector('.lp__card_content');
    const textDiv = document.createElement('div');
    if (content) {
      // Title
      const title = content.querySelector('.lp__card_title');
      if (title) textDiv.appendChild(title.cloneNode(true));
      // Description
      const desc = content.querySelector('.lp__card_description');
      if (desc) textDiv.appendChild(desc.cloneNode(true));
      // CTA (card list)
      const list = content.querySelector('.lp__card_list');
      if (list) textDiv.appendChild(list.cloneNode(true));
    }
    if (image && textDiv.childNodes.length > 0) {
      cardRows.push([image, textDiv]);
    }
  });

  if (!cardRows.length) return;

  const headerRow = ['Cards (cards5)'];
  const cells = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

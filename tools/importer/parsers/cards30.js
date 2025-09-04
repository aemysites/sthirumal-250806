/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from each .col-lg-4
  function extractCard(col) {
    // Find the image
    const img = col.querySelector('img');

    // Find the title (inside .lp__listnav_icon_cta_title > span:first-child)
    let titleSpan = col.querySelector('.lp__listnav_icon_cta_title span');
    let titleText = titleSpan ? titleSpan.textContent.trim() : '';
    let titleEl;
    if (titleText) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleText;
    }

    // Find the description (inside .lp__listnav_icon_cta_bottom > p)
    let descP = col.querySelector('.lp__listnav_icon_cta_bottom p');

    // Compose the text cell
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descP) textCell.push(descP);

    return [img, textCell];
  }

  // Get all card columns
  const cardCols = element.querySelectorAll(':scope .row > .col-lg-4');

  // Build table rows
  const headerRow = ['Cards (cards30)'];
  const rows = Array.from(cardCols).map(extractCard);
  const cells = [headerRow, ...rows];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}

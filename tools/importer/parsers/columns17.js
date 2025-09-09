/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find main content and image columns
  // Left column: .eventdetail__content
  // Right column: .eventdetail__image
  const contentCol = element.querySelector('.eventdetail__content');
  const imageCol = element.querySelector('.eventdetail__image');

  // Defensive: If not found, fallback to first/second child divs
  let leftCell = contentCol;
  let rightCell = imageCol;
  if (!leftCell || !rightCell) {
    const divs = element.querySelectorAll(':scope > div > div');
    leftCell = leftCell || divs[0];
    rightCell = rightCell || divs[1];
  }

  // Table header row
  const headerRow = ['Columns (columns17)'];
  // Table content row: left and right columns
  const contentRow = [leftCell, rightCell];

  // Build table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}

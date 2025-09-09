/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all direct children with class 'ft-social-list'
  const lists = Array.from(element.querySelectorAll(':scope > .ft-social-list'));
  if (lists.length < 3) return; // Expecting 3 columns

  // Each column is the content of one .ft-social-list
  // Use the whole list element for each cell for resilience
  const columnsRow = lists.map(list => list);

  // Table header
  const headerRow = ['Columns (columns1)'];

  // Table rows
  const cells = [headerRow, columnsRow];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}

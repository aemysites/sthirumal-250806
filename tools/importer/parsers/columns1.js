/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all direct ft-social-list children
  const lists = Array.from(element.querySelectorAll(':scope > .ft-social-list'));
  if (lists.length < 3) return; // Expecting 3 columns

  // Header row as per requirements
  const headerRow = ['Columns (columns1)'];

  // Second row: each column is a .ft-social-list
  const contentRow = lists;

  // Build the table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}

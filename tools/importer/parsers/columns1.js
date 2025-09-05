/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Get all direct children with class 'ft-social-list' (should be 3 columns)
  const lists = Array.from(element.querySelectorAll(':scope > .ft-social-list'));

  // Defensive: if not exactly 3, fallback to all direct children
  let columns;
  if (lists.length === 3) {
    columns = lists;
  } else {
    columns = Array.from(element.children);
  }

  // Build the table rows
  const headerRow = ['Columns (columns1)'];
  const contentRow = columns;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}

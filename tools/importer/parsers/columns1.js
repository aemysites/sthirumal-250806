/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all direct children with class 'ft-social-list'
  const lists = Array.from(element.querySelectorAll(':scope > .ft-social-list'));

  // There should be three columns: logo, org links, social icons
  // Defensive: fallback to empty div if missing
  const col1 = lists[0] || document.createElement('div');
  const col2 = lists[1] || document.createElement('div');
  const col3 = lists[2] || document.createElement('div');

  // Table structure: header, then one row with three columns
  const headerRow = ['Columns (columns1)'];
  const contentRow = [col1, col2, col3];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}

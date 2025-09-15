/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract all direct .ft-main-item children as columns
  const columns = Array.from(element.querySelectorAll(':scope > .ft-main-item'));

  // 2. Build the header row with the exact block name
  const headerRow = ['Columns (columns2)'];

  // 3. Each column cell should reference the actual DOM node, not its text or HTML
  // This preserves all formatting, links, and structure
  const columnsRow = columns.map((col) => col);

  // 4. Compose the table data
  const tableData = [headerRow, columnsRow];

  // 5. Create the table block using DOMUtils
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // 6. Replace the original element with the block
  element.replaceWith(table);
}

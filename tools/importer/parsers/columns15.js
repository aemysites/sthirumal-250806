/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main grid for the columns layout
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;
  const columns = Array.from(grid.children);
  if (columns.length < 2) return;

  // LEFT COLUMN: Gather all content (headings, paragraphs, buttons, etc.)
  // Take all direct children to retain order and structure
  let leftColChildren = Array.from(columns[0].children);
  if (!leftColChildren.length) leftColChildren = [columns[0]];
  // Include any text nodes directly in the column (for edge cases)
  const leftTextNodes = Array.from(columns[0].childNodes).filter(
    node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
  ).map(node => document.createTextNode(node.textContent));
  const leftContent = [...leftTextNodes, ...leftColChildren];

  // RIGHT COLUMN: Gather all content (images, text, etc.)
  let rightColChildren = Array.from(columns[1].children);
  // If no child elements, fallback to column itself
  if (!rightColChildren.length) rightColChildren = [columns[1]];
  // Include any text nodes directly in the column
  const rightTextNodes = Array.from(columns[1].childNodes).filter(
    node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
  ).map(node => document.createTextNode(node.textContent));
  const rightContent = [...rightTextNodes, ...rightColChildren];

  // Defensive: if column is empty, ensure at least one cell
  const leftCell = leftContent.length ? leftContent : [''];
  const rightCell = rightContent.length ? rightContent : [''];

  // Compose block table as in the example (header, then one row with two columns)
  const cells = [
    ['Columns (columns15)'],
    [leftCell, rightCell]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

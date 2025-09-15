/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all immediate children that are columns
  const columns = Array.from(element.querySelectorAll(':scope > .ft-social-list'));

  // If not found, fallback to all direct children
  if (columns.length === 0) {
    // fallback: treat all direct children as columns
    Array.from(element.children).forEach((child) => {
      if (child.tagName.toLowerCase() === 'div') {
        columns.push(child);
      }
    });
  }

  // Table header
  const headerRow = ['Columns (columns1)'];

  // Second row: each column cell contains the corresponding ft-social-list div
  const secondRow = columns.map((col) => col);

  // Compose table
  const cells = [headerRow, secondRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}

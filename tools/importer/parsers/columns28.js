/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all immediate children of the finder-container
  const children = Array.from(element.querySelectorAll(':scope > *'));

  // Find all dropdowns and the button
  const dropdowns = children.filter(child => child.classList.contains('custom-dropdown'));
  const button = children.find(child => child.tagName === 'BUTTON');

  // Prepare columns: each dropdown as a column, plus the button as last column
  // Each dropdown and button is referenced directly
  const columnsRow = [
    ...dropdowns,
    button
  ];

  // Table header
  const headerRow = ['Columns (columns28)'];

  // Compose table cells
  const cells = [
    headerRow,
    columnsRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}

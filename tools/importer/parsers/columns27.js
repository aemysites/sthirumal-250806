/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Get all immediate children (dropdowns and button)
  const children = Array.from(element.querySelectorAll(':scope > *'));

  // Find all dropdowns and the button
  const dropdowns = children.filter(el => el.classList.contains('custom-dropdown'));
  const button = children.find(el => el.tagName === 'BUTTON');

  // Build the columns row: dropdowns and button as separate columns
  const columnsRow = [
    ...dropdowns,
    button
  ];

  // Table header row as required
  const headerRow = ['Columns (columns27)'];

  // Build table cells array
  const cells = [
    headerRow,
    columnsRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate children for columns
  const children = Array.from(element.querySelectorAll(':scope > *'));

  // We expect 4 columns: 3 dropdowns + 1 button
  // Each dropdown is a div.custom-dropdown
  // The button is .go-button
  const dropdowns = children.filter(child => child.classList.contains('custom-dropdown'));
  const button = children.find(child => child.classList.contains('go-button'));

  // Build the header row with the exact block name
  const headerRow = ['Columns (columns27)'];

  // Build the columns row: reference the actual DOM elements
  const columnsRow = [
    ...dropdowns,
    button
  ];

  // Create the table block
  const cells = [
    headerRow,
    columnsRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}

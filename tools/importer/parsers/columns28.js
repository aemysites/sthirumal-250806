/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Get all immediate children (dropdowns and button)
  const children = Array.from(element.querySelectorAll(':scope > *'));

  // Find all dropdowns and the button
  const dropdowns = children.filter(child => child.classList.contains('custom-dropdown'));
  const button = children.find(child => child.tagName === 'BUTTON');

  // Each dropdown and the button is a column
  const columns = [...dropdowns, button].filter(Boolean);

  // Table header row
  const headerRow = ['Columns (columns28)'];
  // Table content row: each dropdown/button in its own column
  const contentRow = columns;

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}

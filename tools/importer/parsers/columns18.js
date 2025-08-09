/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout containing the columns
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;

  // Get all direct children of the grid layout
  const gridChildren = Array.from(grid.querySelectorAll(':scope > *'));

  // Identify info box, contact list, and image
  let infoBox = null;
  let contactList = null;
  let image = null;

  for (const child of gridChildren) {
    if (!infoBox && child.querySelector('h2, h3, p')) {
      infoBox = child;
      continue;
    }
    if (!contactList && child.tagName === 'UL') {
      contactList = child;
      continue;
    }
    if (!image && child.tagName === 'IMG') {
      image = child;
      continue;
    }
  }

  // The header row must be a single cell
  const headerRow = ['Columns (columns18)'];
  // The second row contains as many columns as there are non-empty content blocks
  const contentRow = [infoBox, contactList, image].filter(Boolean);

  const cells = [
    headerRow, // single cell for header
    contentRow // n columns for content
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

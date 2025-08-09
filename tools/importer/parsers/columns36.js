/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row exactly as requested
  const headerRow = ['Columns (columns36)'];

  // Defensive: find inner content container
  const container = element.querySelector('.container');
  if (!container) return;
  // Find the grid containing our two columns
  const grid = container.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;
  const gridChildren = Array.from(grid.children);
  if (gridChildren.length < 2) return;

  // First column (text)
  const leftCol = gridChildren[0];
  // Second column (images)
  const rightCol = gridChildren[1];

  // Reference full content blocks for resilience
  // Left: all direct children of leftCol (heading, subheading, button group)
  const leftColContent = Array.from(leftCol.children);
  // Right: all images in the nested grid in rightCol
  let rightColContent = [];
  const innerImgGrid = rightCol.querySelector('.w-layout-grid');
  if (innerImgGrid) {
    rightColContent = Array.from(innerImgGrid.querySelectorAll('img'));
  } else {
    // fallback: any imgs directly under rightCol
    rightColContent = Array.from(rightCol.querySelectorAll('img'));
  }

  // Build table structure: header, then a single row with two columns
  const rows = [
    headerRow,
    [leftColContent, rightColContent]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

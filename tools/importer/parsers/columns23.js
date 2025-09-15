/* global WebImporter */
export default function parse(element, { document }) {
  // Find the color-wrapper div inside the block
  const colorWrapper = element.querySelector('.color-wrapper');
  if (!colorWrapper) return;

  // The only visible content is the two gradient sides (left and right)
  // But these are purely decorative and contain no text or images.
  // To avoid empty/decorative columns, do not include them as cells.
  // Instead, create a single row with empty columns to match the visual structure.
  const headerRow = ['Columns (columns23)'];
  const columnsRow = ['', '']; // Two empty columns, since there is no content

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}

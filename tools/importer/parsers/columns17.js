/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get the main content and image columns
  const contentCol = element.querySelector('.eventdetail__content');
  const imageCol = element.querySelector('.eventdetail__image');

  // Defensive: If either column is missing, do nothing
  if (!contentCol || !imageCol) return;

  // Table header row
  const headerRow = ['Columns (columns17)'];

  // Table content row: left = content, right = image
  const contentRow = [contentCol, imageCol];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}

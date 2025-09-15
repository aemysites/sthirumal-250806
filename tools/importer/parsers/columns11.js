/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main section
  const section = element.querySelector('.eventdetail-section') || element;

  // Get the left column: title and description
  const content = section.querySelector('.eventdetail__content');
  // Get the right column: image
  const imageDiv = section.querySelector('.eventdetail__image');

  // Defensive: fallback if not found
  const leftCol = content || document.createElement('div');
  const rightCol = imageDiv || document.createElement('div');

  // Table header row (must match block name exactly)
  const headerRow = ['Columns (columns11)'];
  // Table content row: two columns, referencing existing elements
  const contentRow = [leftCol, rightCol];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}

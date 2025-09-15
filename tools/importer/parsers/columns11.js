/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main content and image columns
  const section = element.querySelector('.eventdetail-section');
  if (!section) return;
  const columns = Array.from(section.children);
  if (columns.length < 2) return;

  // First column: content (title + description)
  const contentCol = columns.find(col => col.classList.contains('eventdetail__content'));
  // Second column: image
  const imageCol = columns.find(col => col.classList.contains('eventdetail__image'));

  if (!contentCol || !imageCol) return;

  // Table header row
  const headerRow = ['Columns (columns11)'];
  // Table content row: two columns
  const contentRow = [contentCol, imageCol];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}

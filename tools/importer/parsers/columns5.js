/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main content and image columns
  // The structure is: .eventdetail-section > .eventdetail__content and .eventdetail__image
  const section = element.querySelector('.eventdetail-section');
  if (!section) return;

  // Get the two main columns
  const columns = [];

  // First column: content (title + description)
  const contentCol = section.querySelector('.eventdetail__content');
  if (contentCol) {
    columns.push(contentCol);
  } else {
    columns.push('');
  }

  // Second column: image (picture inside a link)
  const imageCol = section.querySelector('.eventdetail__image');
  if (imageCol) {
    columns.push(imageCol);
  } else {
    columns.push('');
  }

  // Header row as required
  const headerRow = ['Columns (columns5)'];
  const tableRows = [headerRow, columns];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}

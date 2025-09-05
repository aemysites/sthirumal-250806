/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section wrapper
  const section = element.querySelector('.eventdetail-section') || element;

  // Get the two columns: content and image
  let contentCol = null;
  let imageCol = null;
  const children = Array.from(section.children);
  children.forEach((child) => {
    if (child.classList.contains('eventdetail__content')) {
      contentCol = child;
    } else if (child.classList.contains('eventdetail__image')) {
      imageCol = child;
    }
  });

  // Fallback: if not found, try to get the first two divs
  if (!contentCol || !imageCol) {
    contentCol = contentCol || children[0];
    imageCol = imageCol || children[1];
  }

  // Build the table rows
  const headerRow = ['Columns (columns5)'];
  const contentRow = [contentCol, imageCol];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}

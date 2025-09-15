/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find main content and image columns
  let contentCol, imageCol;

  // Find the eventdetail__content and eventdetail__image columns
  const children = Array.from(element.querySelectorAll(':scope > .eventdetail-section > div'));
  children.forEach((child) => {
    if (child.classList.contains('eventdetail__content')) {
      contentCol = child;
    } else if (child.classList.contains('eventdetail__image')) {
      imageCol = child;
    }
  });

  // Fallback: If not found, try direct children
  if (!contentCol || !imageCol) {
    Array.from(element.children).forEach((child) => {
      if (child.classList.contains('eventdetail__content')) {
        contentCol = child;
      } else if (child.classList.contains('eventdetail__image')) {
        imageCol = child;
      }
    });
  }

  // Defensive: If still not found, try deeper
  if (!contentCol) {
    contentCol = element.querySelector('.eventdetail__content');
  }
  if (!imageCol) {
    imageCol = element.querySelector('.eventdetail__image');
  }

  // Table header
  const headerRow = ['Columns (columns17)'];

  // Table content row: left column is all content, right column is image
  const contentCell = contentCol ? contentCol : document.createElement('div');
  const imageCell = imageCol ? imageCol : document.createElement('div');

  // Build table
  const cells = [
    headerRow,
    [contentCell, imageCell]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}

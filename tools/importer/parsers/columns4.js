/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main section (should be .eventdetail-section)
  const section = element.querySelector('.eventdetail-section');
  if (!section) return;

  // Get the two main columns: content and image
  // The content is .eventdetail__content, the image is .eventdetail__image
  const contentCol = section.querySelector('.eventdetail__content');
  const imageCol = section.querySelector('.eventdetail__image');

  // Defensive: if either is missing, fallback to the section's children
  let leftCell, rightCell;
  if (contentCol && imageCol) {
    leftCell = contentCol;
    rightCell = imageCol;
  } else {
    // fallback: try to use first two direct children
    const children = Array.from(section.children);
    leftCell = children[0] || document.createElement('div');
    rightCell = children[1] || document.createElement('div');
  }

  // Table header row
  const headerRow = ['Columns (columns4)'];
  // Table content row: two columns, left is content, right is image
  const contentRow = [leftCell, rightCell];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}

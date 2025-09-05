/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find main content and image column
  const section = element.querySelector('.eventdetail-section');
  if (!section) return;

  // Get content column
  const content = section.querySelector('.eventdetail__content');
  // Get image column
  const imageWrapper = section.querySelector('.eventdetail__image');

  // Defensive: Ensure both columns exist
  if (!content || !imageWrapper) return;

  // Table header row
  const headerRow = ['Columns (columns4)'];

  // Table second row: two columns
  // Left column: all content (title, description, enroll button)
  // Right column: image only (picture inside .eventdetail__image)
  // Reference the entire content and image blocks for resilience
  const row = [content, imageWrapper];

  // Build table
  const cells = [headerRow, row];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(block);
}

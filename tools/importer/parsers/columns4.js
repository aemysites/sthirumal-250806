/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only process if the structure matches expected pattern
  const section = element.querySelector('.eventdetail-section');
  if (!section) return;

  // Get left column: content (title, description, button)
  const content = section.querySelector('.eventdetail__content');
  // Get right column: image
  const imageWrapper = section.querySelector('.eventdetail__image');

  // Defensive: Only proceed if both columns exist
  if (!content || !imageWrapper) return;

  // Build header row
  const headerRow = ['Columns (columns4)'];

  // Build content row: left = content, right = image
  // Use the entire content and imageWrapper nodes for resilience
  const contentRow = [content, imageWrapper];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}

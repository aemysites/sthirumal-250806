/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct children of finder-container for columns
  const columns = [];
  const children = Array.from(element.querySelectorAll(':scope > *'));

  children.forEach((child) => {
    // Only include non-empty elements or buttons
    if (child && (child.textContent.trim() || child.tagName === 'BUTTON')) {
      columns.push(child);
    }
  });

  // Table header must match block name exactly
  const headerRow = ['Columns (columns28)'];
  const contentRow = columns;

  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}

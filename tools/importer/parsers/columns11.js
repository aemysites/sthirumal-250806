/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main content and image columns
  // The structure is:
  // <div class="eventdetail_top_banner">
  //   <div class="eventdetail-section">
  //     <div class="eventdetail__content">...</div>
  //     <div class="eventdetail__image">...</div>
  //   </div>
  // </div>

  // Find the direct child .eventdetail-section
  const section = element.querySelector(':scope > .eventdetail-section');
  if (!section) return;

  // Get the two columns
  const columns = section.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  const contentCol = columns[0]; // .eventdetail__content
  const imageCol = columns[1];   // .eventdetail__image

  // Build the table rows
  const headerRow = ['Columns (columns11)'];
  const contentRow = [contentCol, imageCol];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}

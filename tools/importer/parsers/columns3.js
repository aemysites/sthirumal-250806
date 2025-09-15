/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only process expected structure
  if (!element || !element.classList.contains('eventdetail_banner_bottom_content')) return;

  // Header row as required
  const headerRow = ['Columns (columns3)'];

  // Get all immediate child .text blocks (each column)
  const columnDivs = Array.from(element.querySelectorAll(':scope > .text'));

  // For each column, extract the inner .eventdetail-text div (contains the label and value)
  const cells = columnDivs.map((col) => {
    // Defensive: fallback to col if .eventdetail-text missing
    const content = col.querySelector('.eventdetail-text') || col;
    // Return the whole content block for resilience
    return content;
  });

  // Build the table rows
  const tableRows = [headerRow, cells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace original element with block table
  element.replaceWith(block);
}

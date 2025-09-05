/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || element.tagName !== 'DIV') return;

  // Always use the required header row
  const headerRow = ['Columns (columns3)'];

  // Get all immediate children with class 'text' (each column)
  const columnDivs = Array.from(element.querySelectorAll(':scope > .text'));

  // For columns3, use the first 3 columns
  const columns = columnDivs.slice(0, 3).map((colDiv) => {
    // Gather all <p> elements inside .eventdetail-text
    const inner = colDiv.querySelector('.eventdetail-text');
    if (inner) {
      // Create a fragment to hold all <p> elements
      const frag = document.createDocumentFragment();
      Array.from(inner.querySelectorAll('p')).forEach(p => {
        frag.appendChild(p.cloneNode(true));
      });
      return frag;
    }
    return colDiv.textContent.trim();
  });

  // Build the table: header row, then one row with all columns
  const cells = [
    headerRow,
    columns,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}

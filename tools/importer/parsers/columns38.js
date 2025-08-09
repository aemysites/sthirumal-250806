/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Columns (columns38)'];

  // Get all immediate column divs
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, gather ALL contents (not just images)
  // We'll collect their children (so lists, buttons, text, images, etc.) as a block, preserving order
  const contentRow = columnDivs.map(colDiv => {
    // If the column div has more than just an image, collect all children
    // If it's just an image, return the image itself
    const children = Array.from(colDiv.childNodes).filter(node => {
      // Remove empty text nodes
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim() !== '';
      }
      return true;
    });
    // If just one element, return the element; else, return array of elements/nodes
    if (children.length === 1) {
      return children[0];
    }
    return children;
  });

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

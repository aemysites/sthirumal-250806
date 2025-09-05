/* global WebImporter */
export default function parse(element, { document }) {
  // Table structure: 1 column, 3 rows
  // Row 1: block name (must match exactly)
  const headerRow = ['Hero (hero23)'];

  // Row 2: background image or decorative background
  // For this HTML, use the color-wrapper div as the background visual
  const colorWrapper = element.querySelector('.color-wrapper');
  const backgroundRow = [colorWrapper ? colorWrapper : ''];

  // Row 3: content (title, subheading, CTA) - none present in this HTML, so omit the row if empty
  // Check if there is any content outside color-wrapper
  let content = '';
  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
      content += node.textContent.trim() + ' ';
    }
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node !== colorWrapper &&
      !node.classList.contains('color-wrapper')
    ) {
      content += node.textContent.trim() + ' ';
    }
  });
  content = content.trim();
  const contentRow = [content];

  // Always include 3 rows as required by the block spec
  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}

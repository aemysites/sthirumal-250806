/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as shown in the markdown
  const headerRow = ['Hero (hero35)'];

  // Find the grid layout (this is consistent with the provided HTML)
  const grid = element.querySelector('.grid-layout') || element;
  const directChildren = Array.from(grid.children);

  // The block expects 3 rows: header, background image (none in provided HTML), main content

  // 2nd row: background image - none present in these HTML samples
  const backgroundRow = [''];

  // 3rd row: main content (heading, subheading, CTA)
  const cellContent = [];

  // Find the div containing headings and paragraphs
  const textDiv = directChildren.find(child => Array.from(child.children).some(
    el => ['H1','H2','H3','H4','H5','H6','P'].includes(el.tagName)
  ));
  if (textDiv) {
    // Extract all headings and paragraphs in this div (preserving order)
    const contentEls = Array.from(textDiv.children).filter(el =>
      ['H1','H2','H3','H4','H5','H6','P'].includes(el.tagName)
    );
    cellContent.push(...contentEls);
  }

  // Find the CTA link (should be a direct child of grid)
  const cta = directChildren.find(child => child.tagName === 'A');
  if (cta) {
    cellContent.push(cta);
  }

  const tableRows = [
    headerRow,
    backgroundRow,
    [cellContent]
  ];

  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(blockTable);
}

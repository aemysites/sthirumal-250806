/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Locate main grid containing two columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  const columns = Array.from(grid.children);

  // 2. Find the image column (left) and content column (right)
  let imgCol = columns.find(child => child.tagName === 'IMG');
  let contentCol = columns.find(child => child !== imgCol);

  // Build an array of elements to preserve semantic meaning in the right column
  const rightColElements = [];
  if (contentCol) {
    // 2.1. Eyebrow and Tag (horizontally grouped)
    const eyebrowTagGroup = contentCol.querySelector('.flex-horizontal.x-left.y-center');
    if (eyebrowTagGroup) rightColElements.push(eyebrowTagGroup);
    // 2.2. Heading
    const heading = contentCol.querySelector('h2, .h2-heading');
    if (heading) rightColElements.push(heading);
    // 2.3. Author/Date row
    const metaRow = contentCol.querySelector('.flex-horizontal.flex-gap-xxs');
    if (metaRow) rightColElements.push(metaRow);
  }

  // 3. Create the table structure
  const cells = [
    ['Columns (columns32)'],
    [imgCol, rightColElements]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 4. Replace the section with the new table
  element.replaceWith(block);
}

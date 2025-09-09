/* global WebImporter */
export default function parse(element, { document }) {
  // Always output a columns block with the correct header, even if columns are visually empty
  const headerRow = ['Columns (columns23)'];

  // The only visible content in the source is the two gradient divs (left and right)
  // These are decorative, but per requirements, include them as columns
  const colorWrapper = element.querySelector('.color-wrapper');
  if (!colorWrapper) return;

  const leftGradient = colorWrapper.querySelector('.gradient-left-side');
  const rightGradient = colorWrapper.querySelector('.gradient-right-side');

  // Use the gradient divs as the column content (even if empty)
  const leftCell = leftGradient ? leftGradient.cloneNode(true) : '';
  const rightCell = rightGradient ? rightGradient.cloneNode(true) : '';

  // Only include columns for actual gradient divs found
  const contentRow = [];
  if (leftGradient) contentRow.push(leftCell);
  if (rightGradient) contentRow.push(rightCell);

  // If no columns found, still output a single empty column (to avoid empty row)
  if (contentRow.length === 0) contentRow.push('');

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
